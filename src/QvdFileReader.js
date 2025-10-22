// @ts-check

import fs from 'fs';
import xml from 'xml2js';
import assert from 'assert';
import {QvdSymbol} from './QvdSymbol.js';
import {QvdDataFrame} from './QvdDataFrame.js';
import {QvdParseError, QvdValidationError, QvdCorruptedError} from './QvdErrors.js';
import {validatePath} from './util/validatePath.js';

/**
 * Parses a QVD file and loads it into memory.
 */
export class QvdFileReader {
  /**
   * Constructs a new QVD file parser.
   *
   * @param {string} filePath The path to the QVD file to load.
   * @param {Object} [options={}] Options for the reader.
   * @param {string} [options.allowedDir] Optional allowed directory path. If provided, the file
   *   path must be within this directory. Defaults to current working directory.
   */
  constructor(filePath, options = {}) {
    const {allowedDir} = options;
    this._path = validatePath(filePath, allowedDir);
    this._buffer = null;
    this._headerOffset = null;
    this._symbolTableOffset = null;
    this._indexTableOffset = null;
    this._header = null;
    /** @type {Array<Array<import('./QvdSymbol.js').QvdSymbol>>|null} */
    this._symbolTable = null;
    /** @type {Array<Array<number>>|null} */
    this._indexTable = null;
  }

  /**
   * Reads the binary data of the QVD file. This method is part of the parsing process
   * and should not be called directly.
   *
   * @param {number|null} maxRows The maximum number of rows to load. If null, all data is loaded.
   */
  async _readData(maxRows = null) {
    if (maxRows === null) {
      // Load entire file into memory (original behavior)
      this._buffer = await fs.promises.readFile(this._path);
      return;
    }

    const HEADER_DELIMITER = '\r\n\0';
    const CHUNK_SIZE = 64 * 1024; // 64KB chunks

    // Use streaming to find the header delimiter dynamically
    const stream = fs.createReadStream(this._path, {
      highWaterMark: CHUNK_SIZE,
    });

    let headerBuffer = Buffer.alloc(0);
    let headerDelimiterIndex = -1;

    try {
      // Read chunks until we find the delimiter
      for await (const chunk of stream) {
        headerBuffer = Buffer.concat([headerBuffer, chunk]);
        headerDelimiterIndex = headerBuffer.indexOf(HEADER_DELIMITER);

        if (headerDelimiterIndex !== -1) {
          // Found the delimiter, stop streaming
          stream.destroy();
          break;
        }
      }
    } catch (error) {
      // Ignore destroy errors (expected when we stop the stream early)
      if (error && typeof error === 'object' && 'code' in error && error.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
        throw error;
      }
    }

    if (headerDelimiterIndex === -1) {
      throw new QvdCorruptedError(
        'The XML header section does not exist or is not properly delimited from the binary data.',
        {
          file: this._path,
          stage: 'readData',
        },
      );
    }

    const headerEndIndex = headerDelimiterIndex + HEADER_DELIMITER.length;

    // Parse header to get metadata about symbol and index table locations
    const headerXml = headerBuffer.subarray(0, headerEndIndex).toString();
    const headerObj = await xml.parseStringPromise(headerXml, {explicitArray: false});

    if (!headerObj) {
      throw new QvdParseError('The XML header could not be parsed.', {
        file: this._path,
        stage: 'readData',
      });
    }

    const symbolTableOffset = headerEndIndex;
    const symbolTableLength = parseInt(headerObj['QvdTableHeader']['Offset'], 10);
    const indexTableOffset = symbolTableOffset + symbolTableLength;
    const recordSize = parseInt(headerObj['QvdTableHeader']['RecordByteSize'], 10);
    const totalRows = parseInt(headerObj['QvdTableHeader']['NoOfRecords'], 10);
    const rowsToLoad = Math.min(maxRows, totalRows);

    // Calculate how much of the index table we need to read
    const indexTableBytesToRead = rowsToLoad * recordSize;

    // Calculate total bytes needed: header + symbol table + partial index table
    const totalBytesToRead = indexTableOffset + indexTableBytesToRead;

    // Now read the exact portion we need from the file
    const fd = await fs.promises.open(this._path, 'r');
    this._buffer = Buffer.allocUnsafe(totalBytesToRead);
    // @ts-ignore - Buffer type compatibility
    await fd.read(this._buffer, 0, totalBytesToRead, 0);
    await fd.close();
  }

  /**
   * Parses the XML header of the QVD file. This method is part of the parsing process
   * and should not be called directly.
   */
  async _parseHeader() {
    if (!this._buffer) {
      throw new QvdCorruptedError(
        'The QVD file has not been loaded in the proper order or has not been loaded at all.',
        {
          file: this._path,
          stage: 'parseHeader',
        },
      );
    }

    const HEADER_DELIMITER = '\r\n\0';

    const headerBeginIndex = 0;
    const headerDelimiterIndex = this._buffer.indexOf(HEADER_DELIMITER, headerBeginIndex);

    // Check explicitly for -1 (not found) rather than using falsy check (!headerDelimiterIndex)
    // because indexOf() returns 0 when the delimiter is at position 0, which is a valid buffer index.
    // Using !0 would incorrectly treat position 0 as an error.
    if (headerDelimiterIndex === -1) {
      throw new QvdCorruptedError(
        'The XML header section does not exist or is not properly delimited from the binary data.',
        {
          file: this._path,
          stage: 'parseHeader',
        },
      );
    }

    const headerEndIndex = headerDelimiterIndex + HEADER_DELIMITER.length;
    const headerBuffer = this._buffer.subarray(headerBeginIndex, headerEndIndex);

    /*
     * The following instruction parses the XML header into a JSON object. It is important to
     * note that the object is a plain JavaScript object and not an instance of representative
     * class. Hence, types are not casted, therefore all raw values are strings, and child nodes
     * that contain an array of objects are not represented directly as an array but as an object
     * with a property, named like the array item tag, that is an array of the actual objects. The
     * same applies to child nodes that contain a single object and the root node.
     *
     * The following XML representation of the QVD header for example...
     *
     *  <QvdTableHeader>
     *    ...
     *    <Fields>
     *      <QvdFieldHeader>
     *        <FieldName>Field1</FieldName>
     *        ...
     *      </QvdFieldHeader>
     *      <QvdFieldHeader>
     *        <FieldName>Field1</FieldName>
     *        ...
     *      </QvdFieldHeader>
     *    </Fields>
     *  </QvdTableHeader>
     *
     * ...is parsed into the following object:
     *
     *  {
     *    QvdTableHeader: {
     *      ...,
     *      Fields: {
     *        QvdFieldHeader: [
     *          { FieldName: 'Field1', ...},
     *          { FieldName: 'Field2', ...}
     *        ]
     *      }
     *    }
     *  }
     */

    // Note: xml2js (via sax-js) does not support external entity resolution
    // by default, providing inherent protection against XXE attacks.
    this._header = await xml.parseStringPromise(headerBuffer.toString(), {explicitArray: false});

    if (!this._header) {
      throw new QvdParseError('The XML header could not be parsed.', {
        file: this._path,
        stage: 'parseHeader',
      });
    }

    /*
     * Because the three parts of the QVD file, header, symbol and index table, are seamlessly concatenated,
     * the end of the respective previous part is the beginning of the next part.
     */

    this._headerOffset = headerBeginIndex;
    this._symbolTableOffset = headerEndIndex;
    this._indexTableOffset = this._symbolTableOffset + parseInt(this._header['QvdTableHeader']['Offset'], 10);
  }

  /**
   * Parses the symbol table of the QVD file. This method is part of the parsing process
   * and should not be called directly.
   */
  async _parseSymbolTable() {
    if (!this._buffer || !this._header || !this._symbolTableOffset || !this._indexTableOffset) {
      throw new QvdCorruptedError(
        'The QVD file has not been loaded in the proper order or has not been loaded at all.',
        {
          file: this._path,
          stage: 'parseSymbolTable',
        },
      );
    }

    let fields = this._header['QvdTableHeader']['Fields']['QvdFieldHeader'];
    const symbolBuffer = this._buffer.subarray(this._symbolTableOffset, this._indexTableOffset);

    if (!Array.isArray(fields)) {
      fields = [fields];
    }

    /*
     * The symbol table is a contiguous byte array that contains all possible symbols/values of all fields/columns.
     * The symbols/values of one field are stored consecutively in the same order as the fields/columns are defined
     * in the header. The length of the symbol area as well as it's offset, relativ to the begin of the symbol
     * table, are also defined in the header.
     */

    // Validate all field metadata before processing to prevent buffer overflow attacks
    for (const field of fields) {
      const symbolsOffset = parseInt(field['Offset'], 10);
      const symbolsLength = parseInt(field['Length'], 10);

      // Validate offset is a valid number and within bounds
      if (isNaN(symbolsOffset) || !Number.isSafeInteger(symbolsOffset) || symbolsOffset < 0) {
        throw new QvdCorruptedError('Invalid symbol offset', {
          field: field['FieldName'],
          offset: symbolsOffset,
          file: this._path,
          stage: 'parseSymbolTable',
        });
      }

      // Validate length is a valid number and non-negative
      if (isNaN(symbolsLength) || !Number.isSafeInteger(symbolsLength) || symbolsLength < 0) {
        throw new QvdCorruptedError('Invalid symbol length', {
          field: field['FieldName'],
          length: symbolsLength,
          file: this._path,
          stage: 'parseSymbolTable',
        });
      }

      // Validate that offset + length doesn't exceed buffer size
      if (symbolsOffset + symbolsLength > symbolBuffer.length) {
        throw new QvdCorruptedError('Symbol data extends beyond buffer', {
          field: field['FieldName'],
          offset: symbolsOffset,
          length: symbolsLength,
          bufferSize: symbolBuffer.length,
          file: this._path,
          stage: 'parseSymbolTable',
        });
      }
    }

    // Parse all possible symbols of each field/column
    this._symbolTable = fields.map((/** @type {any} */ field) => {
      const symbolsOffset = parseInt(field['Offset'], 10); // Offset of the column's symbol area in the symbol table
      const symbolsLength = parseInt(field['Length'], 10); // Length of the column's symbol area in the symbol table

      const symbols = [];

      // Parse all possible values of the current field/column
      for (let pointer = symbolsOffset; pointer < symbolsOffset + symbolsLength; pointer++) {
        // Each stored symbol consists of a type byte and the actual value, which length depends on the type
        const typeByte = symbolBuffer[pointer++];

        switch (typeByte) {
          case 1: {
            // Integer value (4 Bytes)
            // Validate we have enough bytes for an integer
            if (pointer + 4 > symbolBuffer.length) {
              throw new QvdCorruptedError('Buffer overflow reading integer symbol', {
                field: field['FieldName'],
                pointer: pointer,
                bufferSize: symbolBuffer.length,
                file: this._path,
                stage: 'parseSymbolTable',
              });
            }
            const byteData = new Int32Array(symbolBuffer.subarray(pointer, pointer + 4));
            const value = Buffer.from(byteData).readIntLE(0, byteData.length);

            pointer += 3;
            symbols.push(QvdSymbol.fromIntValue(value));

            break;
          }
          case 2: {
            // Double value (8 Bytes)
            // Validate we have enough bytes for a double
            if (pointer + 8 > symbolBuffer.length) {
              throw new QvdCorruptedError('Buffer overflow reading double symbol', {
                field: field['FieldName'],
                pointer: pointer,
                bufferSize: symbolBuffer.length,
                file: this._path,
                stage: 'parseSymbolTable',
              });
            }
            const byteData = new Int32Array(symbolBuffer.subarray(pointer, pointer + 8));
            const value = Buffer.from(byteData).readDoubleLE(0);

            pointer += 7;
            symbols.push(QvdSymbol.fromDoubleValue(value));

            break;
          }
          case 4: {
            // String value (0 terminated)
            const byteData = [];
            const maxStringLength = 1048576; // 1MB max string size to prevent memory exhaustion

            while (pointer < symbolBuffer.length && symbolBuffer[pointer] !== 0) {
              if (byteData.length >= maxStringLength) {
                throw new QvdCorruptedError('String symbol exceeds maximum length', {
                  field: field['FieldName'],
                  maxLength: maxStringLength,
                  file: this._path,
                  stage: 'parseSymbolTable',
                });
              }
              byteData.push(symbolBuffer[pointer++]);
            }

            // Ensure we found the null terminator
            if (pointer >= symbolBuffer.length) {
              throw new QvdCorruptedError('String symbol not null-terminated', {
                field: field['FieldName'],
                pointer: pointer,
                bufferSize: symbolBuffer.length,
                file: this._path,
                stage: 'parseSymbolTable',
              });
            }

            const value = Buffer.from(byteData).toString('utf-8');
            symbols.push(QvdSymbol.fromStringValue(value));

            break;
          }
          case 5: {
            // Dual (Integer format) value (4 bytes), followed by string format
            // Validate we have enough bytes for an integer
            if (pointer + 4 > symbolBuffer.length) {
              throw new QvdCorruptedError('Buffer overflow reading dual integer symbol', {
                field: field['FieldName'],
                pointer: pointer,
                bufferSize: symbolBuffer.length,
                file: this._path,
                stage: 'parseSymbolTable',
              });
            }
            const intByteData = new Int32Array(symbolBuffer.subarray(pointer, pointer + 4));
            const intValue = Buffer.from(intByteData).readIntLE(0, intByteData.length);

            pointer += 4;

            /** @type {number[]} */
            const stringByteData = [];
            const maxStringLength = 1048576; // 1MB max string size to prevent memory exhaustion

            while (pointer < symbolBuffer.length && symbolBuffer[pointer] !== 0) {
              if (stringByteData.length >= maxStringLength) {
                throw new QvdCorruptedError('Dual string symbol exceeds maximum length', {
                  field: field['FieldName'],
                  maxLength: maxStringLength,
                  file: this._path,
                  stage: 'parseSymbolTable',
                });
              }
              stringByteData.push(symbolBuffer[pointer++]);
            }

            // Ensure we found the null terminator
            if (pointer >= symbolBuffer.length) {
              throw new QvdCorruptedError('Dual string symbol not null-terminated', {
                field: field['FieldName'],
                pointer: pointer,
                bufferSize: symbolBuffer.length,
                file: this._path,
                stage: 'parseSymbolTable',
              });
            }

            const stringValue = Buffer.from(stringByteData).toString('utf-8');
            symbols.push(QvdSymbol.fromDualIntValue(intValue, stringValue));

            break;
          }

          case 6: {
            // Dual (Double format) value (8 bytes), followed by string format
            // Validate we have enough bytes for a double
            if (pointer + 8 > symbolBuffer.length) {
              throw new QvdCorruptedError('Buffer overflow reading dual double symbol', {
                field: field['FieldName'],
                pointer: pointer,
                bufferSize: symbolBuffer.length,
                file: this._path,
                stage: 'parseSymbolTable',
              });
            }
            const doubleByteData = new Int32Array(symbolBuffer.subarray(pointer, pointer + 8));
            const doubleValue = Buffer.from(doubleByteData).readDoubleLE(0);

            pointer += 8;

            /** @type {number[]} */
            const stringByteData = [];
            const maxStringLength = 1048576; // 1MB max string size to prevent memory exhaustion

            while (pointer < symbolBuffer.length && symbolBuffer[pointer] !== 0) {
              if (stringByteData.length >= maxStringLength) {
                throw new QvdCorruptedError('Dual string symbol exceeds maximum length', {
                  field: field['FieldName'],
                  maxLength: maxStringLength,
                  file: this._path,
                  stage: 'parseSymbolTable',
                });
              }
              stringByteData.push(symbolBuffer[pointer++]);
            }

            // Ensure we found the null terminator
            if (pointer >= symbolBuffer.length) {
              throw new QvdCorruptedError('Dual string symbol not null-terminated', {
                field: field['FieldName'],
                pointer: pointer,
                bufferSize: symbolBuffer.length,
                file: this._path,
                stage: 'parseSymbolTable',
              });
            }

            const stringValue = Buffer.from(stringByteData).toString('utf-8');
            symbols.push(QvdSymbol.fromDualDoubleValue(doubleValue, stringValue));

            break;
          }
          default: {
            throw new QvdParseError('Unknown symbol type byte', {
              typeByte: typeByte.toString(16),
              offset: pointer,
              file: this._path,
              stage: 'parseSymbolTable',
            });
          }
        }
      }

      return symbols;
      // @ts-ignore - Symbol table type assignment
    });
  }

  /**
   * Utility method to convert a bit array to an integer value.
   *
   * @param {Array<number>} bits The bit array
   * @return {Number} The integer value
   */
  _convertBitsToInt32(bits) {
    if (bits.length === 0) {
      return 0;
    }

    return bits.reduce((value, bit, index) => (value += bit * Math.pow(2, index)), 0);
  }

  /**
   * Parses the bit stuffed index table of the QVD file. This method is part of the parsing process
   * and should not be called directly.
   *
   * @param {number|null} maxRows The maximum number of rows to parse. If null, all rows are parsed.
   */
  async _parseIndexTable(maxRows = null) {
    if (!this._buffer || !this._header || !this._indexTableOffset) {
      throw new QvdCorruptedError(
        'The QVD file has not been loaded in the proper order or has not been loaded at all.',
        {
          file: this._path,
          stage: 'parseIndexTable',
        },
      );
    }

    let fields = this._header['QvdTableHeader']['Fields']['QvdFieldHeader'];

    if (!Array.isArray(fields)) {
      fields = [fields];
    }

    // Size of a single row of the index table in bytes
    const recordSize = parseInt(this._header['QvdTableHeader']['RecordByteSize'], 10);

    // Validate recordSize
    if (isNaN(recordSize) || !Number.isSafeInteger(recordSize) || recordSize < 0) {
      throw new QvdCorruptedError('Invalid record byte size', {
        recordSize: recordSize,
        file: this._path,
        stage: 'parseIndexTable',
      });
    }

    // Explicitly disallow zero record size to prevent infinite loops
    if (recordSize === 0) {
      throw new QvdCorruptedError('Record byte size cannot be zero', {
        recordSize: recordSize,
        file: this._path,
        stage: 'parseIndexTable',
      });
    }

    // Validate recordSize is reasonable (max 1MB per record)
    if (recordSize > 1048576) {
      throw new QvdCorruptedError('Record byte size exceeds maximum', {
        recordSize: recordSize,
        maxSize: 1048576,
        file: this._path,
        stage: 'parseIndexTable',
      });
    }

    const totalRows = parseInt(this._header['QvdTableHeader']['NoOfRecords'], 10);

    // Validate totalRows
    if (isNaN(totalRows) || !Number.isSafeInteger(totalRows) || totalRows < 0) {
      throw new QvdCorruptedError('Invalid number of records', {
        totalRows: totalRows,
        file: this._path,
        stage: 'parseIndexTable',
      });
    }

    const rowsToLoad = maxRows !== null ? Math.min(maxRows, totalRows) : totalRows;

    const indexTableLength = parseInt(this._header['QvdTableHeader']['Length'], 10);

    // Validate index table length
    if (isNaN(indexTableLength) || !Number.isSafeInteger(indexTableLength) || indexTableLength < 0) {
      throw new QvdCorruptedError('Invalid index table length', {
        length: indexTableLength,
        file: this._path,
        stage: 'parseIndexTable',
      });
    }

    // Validate index table start offset doesn't extend beyond buffer
    // Note: subarray automatically clamps the end index, so we only need to validate
    // that the start of the index table is within bounds and that we have at least
    // some data to read. We allow the end to be at or slightly beyond buffer.length
    // since subarray will clamp it appropriately.
    if (this._indexTableOffset > this._buffer.length) {
      throw new QvdCorruptedError('Index table offset beyond buffer', {
        indexTableOffset: this._indexTableOffset,
        bufferSize: this._buffer.length,
        file: this._path,
        stage: 'parseIndexTable',
      });
    }

    // Validate that the claimed index table length isn't excessively large
    // (more than 100MB beyond actual buffer size would indicate corruption)
    const maxReasonableOverage = 100 * 1024 * 1024;
    if (indexTableLength > this._buffer.length + maxReasonableOverage) {
      throw new QvdCorruptedError('Index table length unreasonably large', {
        indexTableLength: indexTableLength,
        bufferSize: this._buffer.length,
        file: this._path,
        stage: 'parseIndexTable',
      });
    }

    // Ensure the index table length is sufficient for the number of rows to load
    const requiredIndexBytes = rowsToLoad * recordSize;
    if (indexTableLength < requiredIndexBytes) {
      throw new QvdCorruptedError('Index table length smaller than required', {
        indexTableLength: indexTableLength,
        requiredBytes: requiredIndexBytes,
        rowsToLoad: rowsToLoad,
        recordSize: recordSize,
        file: this._path,
        stage: 'parseIndexTable',
      });
    }

    const indexBuffer = this._buffer.subarray(this._indexTableOffset, this._indexTableOffset + indexTableLength + 1);

    // Validate BitOffset and BitWidth for all fields before processing
    for (const field of fields) {
      const bitOffset = parseInt(field['BitOffset'], 10);
      const bitWidth = parseInt(field['BitWidth'], 10);

      // Validate bitOffset
      if (isNaN(bitOffset) || !Number.isSafeInteger(bitOffset) || bitOffset < 0) {
        throw new QvdCorruptedError('Invalid bit offset', {
          field: field['FieldName'],
          bitOffset: bitOffset,
          file: this._path,
          stage: 'parseIndexTable',
        });
      }

      // Validate bitWidth
      if (isNaN(bitWidth) || !Number.isSafeInteger(bitWidth) || bitWidth < 0) {
        throw new QvdCorruptedError('Invalid bit width', {
          field: field['FieldName'],
          bitWidth: bitWidth,
          file: this._path,
          stage: 'parseIndexTable',
        });
      }

      // Validate bitOffset + bitWidth doesn't exceed record size in bits
      const recordSizeInBits = recordSize * 8;
      if (bitOffset + bitWidth > recordSizeInBits) {
        throw new QvdCorruptedError('Bit field extends beyond record size', {
          field: field['FieldName'],
          bitOffset: bitOffset,
          bitWidth: bitWidth,
          recordSizeInBits: recordSizeInBits,
          file: this._path,
          stage: 'parseIndexTable',
        });
      }
    }

    this._indexTable = [];

    // Parse rows of the index table, each row contains the indices of the symbol table for each field/column
    for (
      let pointer = 0, rowCount = 0;
      pointer < indexBuffer.length && rowCount < rowsToLoad;
      pointer += recordSize, rowCount++
    ) {
      // Validate we have enough bytes for this record
      if (pointer + recordSize > indexBuffer.length) {
        throw new QvdCorruptedError('Buffer overflow reading index table record', {
          pointer: pointer,
          recordSize: recordSize,
          bufferSize: indexBuffer.length,
          file: this._path,
          stage: 'parseIndexTable',
        });
      }

      const bytes = new Int32Array(indexBuffer.subarray(pointer, pointer + recordSize));
      bytes.reverse();

      // The bit mask contains the bit stuffed indices of the symbol table of the current row
      const mask = bytes
        .reduce((bits, byte) => bits + ('00000000' + byte.toString(2)).slice(-8), '')
        .split('')
        .reverse()
        .map((bit) => parseInt(bit));

      /** @type {number[]} */
      const symbolIndices = [];

      // Extract the index from the current row's bit mask for each field/column
      fields.forEach((/** @type {any} */ field) => {
        const bitOffset = parseInt(field['BitOffset'], 10);
        const bitWidth = parseInt(field['BitWidth'], 10);
        const bias = parseInt(field['Bias'], 10);

        let symbolIndex;

        if (bitWidth === 0) {
          symbolIndex = 0;
        } else {
          symbolIndex = this._convertBitsToInt32(mask.slice(bitOffset, bitOffset + bitWidth));
        }

        symbolIndex += bias;
        symbolIndices.push(symbolIndex);
      });

      this._indexTable.push(symbolIndices);
    }
  }

  /**
   * Loads the QVD file into memory and parses it.
   *
   * @param {number|null} maxRows The maximum number of rows to load. If null, all rows are loaded.
   * @return {Promise<QvdDataFrame>} The loaded QVD file.
   */
  async load(maxRows = null) {
    await this._readData(maxRows);
    await this._parseHeader();
    await this._parseSymbolTable();
    await this._parseIndexTable(maxRows);

    assert(this._header, 'The QVD file header has not been parsed.');
    assert(this._symbolTable, 'The QVD file symbol table has not been parsed.');
    assert(this._indexTable, 'The QVD file index table has not been parsed.');

    /**
     * Retrieves the values of a specific row of the QVD file. Values are in the same order
     * as the field names.
     *
     * @param {number} index The index of the row.
     * @return {Array<any>} The values of the row.
     */
    const getRow = (index) => {
      if (!this._indexTable || index >= this._indexTable.length) {
        throw new QvdValidationError('Row index out of bounds', {
          index: index,
          max: this._indexTable ? this._indexTable.length - 1 : -1,
          file: this._path,
        });
      }

      return this._indexTable?.[index].map((/** @type {number} */ symbolIndex, /** @type {number} */ fieldIndex) => {
        if (symbolIndex < 0) {
          return null;
        }

        const symbol = this._symbolTable?.[fieldIndex]?.[symbolIndex];
        const value = symbol?.toPrimaryValue();

        if (typeof value === 'string') {
          if (!isNaN(Number(value))) {
            return Number(value);
          }
        }

        return value;
      });
    };

    let fields = this._header['QvdTableHeader']['Fields']['QvdFieldHeader'];

    if (!Array.isArray(fields)) {
      fields = [fields];
    }

    const columns = fields.map((/** @type {any} */ field) => field['FieldName']);
    const data = this._indexTable.map((_, index) => getRow(index));

    // Pass the complete header metadata to the data frame
    const metadata = this._header['QvdTableHeader'];

    return new QvdDataFrame(data, columns, metadata);
  }
}
