// @ts-check

import fs from 'fs';
import xml from 'xml2js';
import assert from 'assert';
import {QvdSymbol} from './QvdSymbol.js';
import {QvdDataFrame} from './QvdDataFrame.js';
import {QvdParseError, QvdValidationError, QvdCorruptedError} from './QvdErrors.js';

/**
 * Parses a QVD file and loads it into memory.
 */
export class QvdFileReader {
  /**
   * Constructs a new QVD file parser.
   *
   * @param {string} path The path to the QVD file to load.
   */
  constructor(path) {
    this._path = path;
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
   */
  async _readData() {
    const fd = await fs.promises.open(this._path, 'r');
    this._buffer = await fs.promises.readFile(fd);
    fd.close();
  }

  /**
   * Parses the XML header of the QVD file. This method is part of the parsing process
   * and should not be called directly.
   */
  async _parseHeader() {
    if (!this._buffer) {
      throw new QvdCorruptedError('The QVD file has not been loaded in the proper order or has not been loaded at all.', {
        file: this._path,
        stage: 'parseHeader',
      });
    }

    const HEADER_DELIMITER = '\r\n\0';

    const headerBeginIndex = 0;
    const headerDelimiterIndex = this._buffer.indexOf(HEADER_DELIMITER, headerBeginIndex);

    if (!headerDelimiterIndex) {
      throw new QvdCorruptedError('The XML header section does not exist or is not properly delimited from the binary data.', {
        file: this._path,
        stage: 'parseHeader',
      });
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
      throw new QvdCorruptedError('The QVD file has not been loaded in the proper order or has not been loaded at all.', {
        file: this._path,
        stage: 'parseSymbolTable',
      });
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
            const byteData = new Int32Array(symbolBuffer.subarray(pointer, pointer + 4));
            const value = Buffer.from(byteData).readIntLE(0, byteData.length);

            pointer += 3;
            symbols.push(QvdSymbol.fromIntValue(value));

            break;
          }
          case 2: {
            // Double value (8 Bytes)
            const byteData = new Int32Array(symbolBuffer.subarray(pointer, pointer + 8));
            const value = Buffer.from(byteData).readDoubleLE(0);

            pointer += 7;
            symbols.push(QvdSymbol.fromDoubleValue(value));

            break;
          }
          case 4: {
            // String value (0 terminated)
            const byteData = [];

            while (symbolBuffer[pointer] !== 0) {
              byteData.push(symbolBuffer[pointer++]);
            }

            const value = Buffer.from(byteData).toString('utf-8');
            symbols.push(QvdSymbol.fromStringValue(value));

            break;
          }
          case 5: {
            // Dual (Integer format) value (4 bytes), followed by string format
            const intByteData = new Int32Array(symbolBuffer.subarray(pointer, pointer + 4));
            const intValue = Buffer.from(intByteData).readIntLE(0, intByteData.length);

            pointer += 4;

            /** @type {number[]} */
            const stringByteData = [];

            while (symbolBuffer[pointer] !== 0) {
              stringByteData.push(symbolBuffer[pointer++]);
            }

            const stringValue = Buffer.from(stringByteData).toString('utf-8');
            symbols.push(QvdSymbol.fromDualIntValue(intValue, stringValue));

            break;
          }

          case 6: {
            // Dual (Double format) value (8 bytes), followed by string format
            const doubleByteData = new Int32Array(symbolBuffer.subarray(pointer, pointer + 8));
            const doubleValue = Buffer.from(doubleByteData).readDoubleLE(0);

            pointer += 8;

            /** @type {number[]} */
            const stringByteData = [];

            while (symbolBuffer[pointer] !== 0) {
              stringByteData.push(symbolBuffer[pointer++]);
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
   */
  async _parseIndexTable() {
    if (!this._buffer || !this._header || !this._indexTableOffset) {
      throw new QvdCorruptedError('The QVD file has not been loaded in the proper order or has not been loaded at all.', {
        file: this._path,
        stage: 'parseIndexTable',
      });
    }

    let fields = this._header['QvdTableHeader']['Fields']['QvdFieldHeader'];

    if (!Array.isArray(fields)) {
      fields = [fields];
    }

    // Size of a single row of the index table in bytes
    const recordSize = parseInt(this._header['QvdTableHeader']['RecordByteSize'], 10);

    const indexBuffer = this._buffer.subarray(
      this._indexTableOffset,
      this._indexTableOffset + parseInt(this._header['QvdTableHeader']['Length'], 10) + 1,
    );

    this._indexTable = [];

    // Parse all rows of the index table, each row contains the indices of the symbol table for each field/column
    for (let pointer = 0; pointer < indexBuffer.length; pointer += recordSize) {
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
   * @return {Promise<QvdDataFrame>} The loaded QVD file.
   */
  async load() {
    await this._readData();
    await this._parseHeader();
    await this._parseSymbolTable();
    await this._parseIndexTable();

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
