// @ts-check

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import xml from 'xml2js';
import assert from 'assert';
import {QvdSymbol} from './QvdSymbol.js';
import {validatePath} from './util/validatePath.js';

/**
 * @typedef {import('./QvdDataFrame.js').QvdDataFrame} QvdDataFrame
 */

/**
 * Persists a QVD file to disk.
 */
export class QvdFileWriter {
  /**
   * Constructs a new QVD file writer.
   *
   * @param {string} filePath The path to the QVD file to write.
   * @param {QvdDataFrame} df The data frame to write to the QVD file.
   * @param {Object} [options={}] Options for the writer.
   * @param {string} [options.allowedDir] Optional allowed directory path. If provided, the file
   *   path must be within this directory. Defaults to current working directory.
   * @param {Function} [options.onProgress] Optional progress callback function.
   */
  constructor(filePath, df, options = {}) {
    const {allowedDir, onProgress} = options;
    this._path = validatePath(filePath, allowedDir);
    this._df = df;
    this._onProgress = onProgress;
    this._header = null;
    this._symbolBuffer = null;
    /** @type {Array<Array<import('./QvdSymbol.js').QvdSymbol>>|null} */
    this._symbolTable = null;
    /** @type {Array<any>|null} */
    this._symbolTableMetadata = null;
    this._indexBuffer = null;
    /** @type {Array<any>|null} */
    this._indexTable = null;
    /** @type {Array<any>|null} */
    this._indexTableMetadata = null;
    this._recordByteSize = null;
  }

  /**
   * Emits a progress event if a callback is registered.
   *
   * @param {string} stage The current stage of the operation.
   * @param {number} current The current progress value.
   * @param {number} total The total progress value.
   */
  _emitProgress(stage, current, total) {
    if (this._onProgress) {
      const percent = total > 0 ? Math.round((current / total) * 100) : 100;
      this._onProgress({
        stage,
        current,
        total,
        percent,
      });
    }
  }

  /**
   * Writes the data to the QVD file.
   */
  async _writeData() {
    assert(this._header, 'The QVD file header has not been parsed.');
    assert(this._symbolBuffer, 'The QVD file symbol table has not been parsed.');
    assert(this._indexBuffer, 'The QVD file index table has not been parsed.');

    this._emitProgress('write', 0, 1);

    // @ts-ignore - Buffer.concat type compatibility
    const headerBuffer = Buffer.concat([Buffer.from(this._header, 'utf-8'), Buffer.from([0])]);

    let fd;
    try {
      fd = await fs.promises.open(this._path, 'w');
      await fd.write(headerBuffer, 0, headerBuffer.length, 0);
      await fd.write(this._symbolBuffer, 0, this._symbolBuffer.length, headerBuffer.length);
      await fd.write(this._indexBuffer, 0, this._indexBuffer.length, headerBuffer.length + this._symbolBuffer.length);
      this._emitProgress('write', 1, 1);
    } finally {
      if (fd) {
        await fd.close();
      }
    }
  }

  /**
   * Builds the XML header of the QVD file.
   */
  _buildHeader() {
    this._emitProgress('header', 0, 1);
    const creationDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    /** @type {import('./QvdDataFrame.js').QvdMetadata|null} */
    const existingMetadata = this._df.metadata;

    // Use existing metadata if available, otherwise create default values
    const baseMetadata = existingMetadata
      ? {
          QvBuildNo: existingMetadata.QvBuildNo || 50667,
          CreatorDoc: existingMetadata.CreatorDoc || crypto.randomUUID(),
          CreateUtcTime: existingMetadata.CreateUtcTime || creationDate,
          SourceCreateUtcTime: existingMetadata.SourceCreateUtcTime || '',
          SourceFileUtcTime: existingMetadata.SourceFileUtcTime || '',
          SourceFileSize: existingMetadata.SourceFileSize || -1,
          StaleUtcTime: existingMetadata.StaleUtcTime || '',
          TableName: existingMetadata.TableName || path.basename(this._path, path.extname(this._path)),
          Compression: existingMetadata.Compression || '',
          Comment: existingMetadata.Comment || '',
          EncryptionInfo: existingMetadata.EncryptionInfo || '',
          TableTags: existingMetadata.TableTags || '',
          ProfilingData: existingMetadata.ProfilingData || '',
          Lineage: existingMetadata.Lineage || {
            LineageInfo: {
              Discriminator: 'INLINE;',
              Statement: '',
            },
          },
        }
      : {
          QvBuildNo: 50667,
          CreatorDoc: crypto.randomUUID(),
          CreateUtcTime: creationDate,
          SourceCreateUtcTime: '',
          SourceFileUtcTime: '',
          SourceFileSize: -1,
          StaleUtcTime: '',
          TableName: path.basename(this._path, path.extname(this._path)),
          Compression: '',
          Comment: '',
          EncryptionInfo: '',
          TableTags: '',
          ProfilingData: '',
          Lineage: {
            LineageInfo: {
              Discriminator: 'INLINE;',
              Statement: '',
            },
          },
        };

    // Get existing field metadata if available
    /** @type {any[]} */
    let existingFields = [];
    if (existingMetadata && existingMetadata.Fields && existingMetadata.Fields.QvdFieldHeader) {
      existingFields = Array.isArray(existingMetadata.Fields.QvdFieldHeader)
        ? existingMetadata.Fields.QvdFieldHeader
        : [existingMetadata.Fields.QvdFieldHeader];
    }

    const xmlObject = {
      QvdTableHeader: {
        ...baseMetadata,
        Fields: {
          QvdFieldHeader: this._df.columns.map((/** @type {any} */ column, /** @type {number} */ index) => {
            // Find existing field metadata for this column
            const existingField = existingFields.find((/** @type {any} */ f) => f.FieldName === column);

            return {
              FieldName: column,
              BitOffset: this._indexTableMetadata?.[index][0],
              BitWidth: this._indexTableMetadata?.[index][1],
              Bias: this._indexTableMetadata?.[index][2],
              NoOfSymbols: this._symbolTable?.[index].length,
              Offset: this._symbolTableMetadata?.[index][0],
              Length: this._symbolTableMetadata?.[index][1],
              Comment: existingField?.Comment || '',
              NumberFormat: existingField?.NumberFormat || {
                Type: 'UNKNOWN',
                nDec: '0',
                UseThou: '0',
                Fmt: '',
                Dec: '',
                Thou: '',
              },
              Tags: existingField?.Tags || {},
            };
          }),
        },
        NoOfRecords: this._indexTable?.length,
        RecordByteSize: this._recordByteSize,
        Offset:
          this._symbolTableMetadata && this._symbolTableMetadata.length > 0
            ? this._symbolTableMetadata[this._symbolTableMetadata.length - 1][0] +
              this._symbolTableMetadata[this._symbolTableMetadata.length - 1][1]
            : 0,
        Length: this._indexBuffer?.length,
      },
    };

    const builder = new xml.Builder({
      renderOpts: {
        pretty: true,
        newline: '\r\n',
        indent: '  ',
      },
    });
    this._header = builder.buildObject(xmlObject) + '\r\n';
    this._emitProgress('header', 1, 1);
  }

  /**
   * Builds the symbol table of the QVD file.
   * Optimized to build all columns in a single pass through the data.
   */
  _buildSymbolTable() {
    this._symbolTable = [];
    this._symbolTableMetadata = [];
    this._symbolBuffer = Buffer.alloc(0);

    const numColumns = this._df.columns.length;

    this._emitProgress('symbol-table', 0, numColumns);

    // Initialize a Set for each column to track unique values
    const uniqueValuesSets = this._df.columns.map(() => new Set());

    // Single pass through all data to collect unique values for all columns
    this._df.data.forEach((row) => {
      this._df.columns.forEach((column, columnIndex) => {
        const value = row[columnIndex];
        uniqueValuesSets[columnIndex].add(value);
      });
    });

    // Process each column's unique values
    this._df.columns.forEach((column, columnIndex) => {
      const uniqueValuesSet = uniqueValuesSets[columnIndex];
      const uniqueValues = Array.from(uniqueValuesSet);
      const containsNull = uniqueValues.includes(null) || uniqueValues.includes(undefined);
      const symbols = uniqueValues
        .filter((value) => value !== null && value !== undefined)
        .map((value) => QvdFileWriter._convertRawToSymbol(value));

      // @ts-ignore:next-line sd
      const currentSymbolBuffer = Buffer.concat(symbols.map((symbol) => symbol.toByteRepresentation()));
      this._symbolBuffer = this._symbolBuffer
        ? Buffer.concat([this._symbolBuffer, currentSymbolBuffer])
        : currentSymbolBuffer;

      const symbolsLength = currentSymbolBuffer.length;
      const symbolsOffset = this._symbolBuffer.length - symbolsLength;

      this._symbolTableMetadata?.push([symbolsOffset, symbolsLength, containsNull]);
      // @ts-ignore - Symbol array type compatibility
      this._symbolTable?.push(symbols);

      this._emitProgress('symbol-table', columnIndex + 1, numColumns);
    });
  }

  /**
   * Builds the index table of the QVD file.
   * Optimized with Map-based lookups for O(1) symbol index retrieval.
   */
  _buildIndexTable() {
    this._indexTable = [];
    this._indexTableMetadata = [];
    this._indexBuffer = Buffer.alloc(0);

    const numRows = this._df.data.length;
    this._emitProgress('index-table', 0, numRows);

    // Build symbol-to-index lookup maps for O(1) lookups
    // This converts the O(n×m×s) findIndex operations to O(n×m)
    const symbolIndexMaps = this._symbolTable?.map((symbols) => {
      const map = new Map();
      symbols.forEach((symbol, idx) => {
        // Create a unique key for each symbol based on its values
        const key = `${symbol.intValue}|${symbol.doubleValue}|${symbol.stringValue}`;
        map.set(key, idx);
      });
      return map;
    });

    let processedRows = 0;
    const progressInterval = Math.max(1, Math.floor(numRows / 100)); // Report progress every 1%

    this._df.data.forEach((/** @type {any} */ row) => {
      // Convert the raw values to indices referring to the symbol table
      const indices = this._df.columns.map((/** @type {any} */ column, columnIndex) => {
        const value = row[columnIndex];
        const symbol = QvdFileWriter._convertRawToSymbol(value);
        const fieldContainsNull = this._symbolTableMetadata?.[columnIndex][2];

        // None values are represented by bias shifted negative indices
        if (symbol === null) {
          return 0;
        } else {
          // Use the Map for O(1) lookup instead of findIndex
          const key = `${symbol.intValue}|${symbol.doubleValue}|${symbol.stringValue}`;
          const symbolIndex = symbolIndexMaps?.[columnIndex].get(key);
          // In order to represent None values, the indices are shifted by the bias value of the column
          return fieldContainsNull ? (symbolIndex ?? 0) + 2 : (symbolIndex ?? 0);
        }
      });

      // Convert the integer indices to binary representation
      /** @type {string[]} */
      const stringIndices = indices.map((/** @type {number} */ index) => {
        const bits = QvdFileWriter._convertInt32ToBits(index, 32);
        let bitString = bits.join('');
        bitString = bitString.replace(/^0+/, '') || '0';
        return bitString;
      });

      // @ts-ignore - Index array type compatibility
      this._indexTable?.push(stringIndices);

      // Report progress periodically
      processedRows++;
      if (processedRows % progressInterval === 0 || processedRows === numRows) {
        this._emitProgress('index-table', processedRows, numRows);
      }
    });

    // Normalize the bit representation of the indices by padding with zeros
    this._df.columns.forEach((column) => {
      // Bit offset is the sum of the bit widths of all previous columns
      const bitOffset = this._indexTableMetadata
        ?.slice(0, this._df.columns.indexOf(column))
        .reduce((sum, metadata) => sum + metadata[1], 0);

      assert(this._indexTable, 'The QVD file header has not been parsed.');

      // Bit width is the maximum bit width of all indices of the column
      // For empty data, default to 0 bit width
      const bitWidth =
        this._indexTable.length > 0
          ? Math.max(
              ...this._indexTable.map(
                (/** @type{string[]} */ indices) => indices[this._df.columns.indexOf(column)].length,
              ),
            )
          : 0;

      const fieldContainsNull = this._symbolTableMetadata?.[this._df.columns.indexOf(column)][2];
      const bias = fieldContainsNull ? -2 : 0;

      this._indexTableMetadata?.push([bitOffset, bitWidth, bias]);

      // Pad the bit representation of the indices with zeros to match the bit width
      this._indexTable.forEach((/** @type{string[]} */ indices) => {
        const bitString = indices[this._df.columns.indexOf(column)];
        const paddedBitString = bitString.padStart(bitWidth, '0');
        indices[this._df.columns.indexOf(column)] = paddedBitString;
      });
    });

    // Concatenate the bit representation of the indices of each row to a single binary string per row
    // @ts-ignore - Buffer.concat type compatibility
    this._indexBuffer = Buffer.concat(
      // @ts-ignore - Buffer array type compatibility
      this._indexTable.map((/** @type{string[]} */ indices) => {
        indices.reverse();
        const bits = indices.join('');
        const paddingWidth = (8 - (bits.length % 8)) % 8;
        const paddedBits = bits.padStart(bits.length + paddingWidth, '0');
        const bytes = paddedBits.match(/.{1,8}/g)?.map((byte) => parseInt(byte, 2));
        bytes?.reverse();

        assert(bytes, 'Byte conversion of bit indices failed.');

        return Buffer.from(Uint8Array.from(bytes));
      }),
    );

    // For empty data, set record byte size to 1 (matching Qlik Sense behavior)
    // instead of 0 or NaN/Infinity
    this._recordByteSize = this._indexTable.length > 0 ? this._indexBuffer.length / this._indexTable.length : 1;
  }

  /**
   * Converts a raw value/literal to a QVD symbol.
   *
   * @param {any} raw The raw value/literal to convert.
   * @return {QvdSymbol|null} The converted QVD symbol.
   */
  static _convertRawToSymbol(raw) {
    if (raw === null || raw === undefined) {
      return null;
    }

    const INT32_MIN = -2147483648;
    const INT32_MAX = 2147483647;

    const isInteger = typeof raw === 'number' && Number.isInteger(raw);
    const isFloat = typeof raw === 'number' && !Number.isInteger(raw);
    const isWithinInt32Range = typeof raw === 'number' && raw >= INT32_MIN && raw <= INT32_MAX;

    if (isInteger && isWithinInt32Range) {
      return QvdSymbol.fromDualIntValue(raw, raw.toString());
    } else if (isFloat || (isInteger && !isWithinInt32Range)) {
      return QvdSymbol.fromDualDoubleValue(raw, raw.toString());
    } else {
      return QvdSymbol.fromStringValue(raw);
    }
  }

  /**
   * Converts an integer to a list of bits.
   *
   * @param {number} value The integer value to convert.
   * @param {number} width The width of the bit list.
   * @return {Array<number>} The list of bits.
   */
  static _convertInt32ToBits(value, width) {
    return value
      .toString(2)
      .split('')
      .map((bit) => parseInt(bit))
      .reverse()
      .concat(new Array(width).fill(0))
      .slice(0, width)
      .reverse();
  }

  /**
   * Persists the data frame to a QVD file.
   */
  async save() {
    this._buildSymbolTable();
    this._buildIndexTable();
    this._buildHeader();
    await this._writeData();
  }
}
