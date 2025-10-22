// @ts-check

import {QvdValidationError} from './QvdErrors.js';

/**
 * @typedef {Object} QvdNumberFormat
 * @property {string} Type - Number format type
 * @property {string} nDec - Number of decimals
 * @property {string} UseThou - Use thousands separator
 * @property {string} Fmt - Format string
 * @property {string} Dec - Decimal separator
 * @property {string} Thou - Thousands separator
 */

/**
 * @typedef {Object} QvdFieldHeader
 * @property {string} FieldName - The name of the field
 * @property {string|number} [BitOffset] - The bit offset
 * @property {string|number} [BitWidth] - The bit width
 * @property {string|number} [Bias] - The bias value
 * @property {string|number} [NoOfSymbols] - Number of symbols
 * @property {string|number} [Offset] - The offset
 * @property {string|number} [Length] - The length
 * @property {string} [Comment] - Field comment
 * @property {QvdNumberFormat|string} [NumberFormat] - Number format
 * @property {Object|string} [Tags] - Field tags
 */

/**
 * @typedef {Object} QvdFields
 * @property {QvdFieldHeader|QvdFieldHeader[]} QvdFieldHeader - Field header(s)
 */

/**
 * @typedef {Object} QvdMetadata
 * @property {string|number} [QvBuildNo] - QlikView build number
 * @property {string} [CreatorDoc] - Creator document
 * @property {string} [CreateUtcTime] - Creation UTC time
 * @property {string} [SourceCreateUtcTime] - Source creation UTC time
 * @property {string} [SourceFileUtcTime] - Source file UTC time
 * @property {string|number} [SourceFileSize] - Source file size
 * @property {string} [StaleUtcTime] - Stale UTC time
 * @property {string} [TableName] - Table name
 * @property {string|number} [NoOfRecords] - Number of records
 * @property {string|number} [RecordByteSize] - Record byte size
 * @property {string|number} [Offset] - Offset
 * @property {string|number} [Length] - Length
 * @property {string} [Compression] - Compression type
 * @property {string} [Comment] - Comment
 * @property {string} [EncryptionInfo] - Encryption info
 * @property {string} [TableTags] - Table tags
 * @property {string} [ProfilingData] - Profiling data
 * @property {Object|string} [Lineage] - Lineage
 * @property {QvdFields} [Fields] - Fields information
 */

/**
 * Represents a loaded QVD file.
 */
export class QvdDataFrame {
  /**
   * Represents the data frame stored inside a QVD file.
   * @param {Array<Array<any>>} data The data of the data frame.
   * @param {Array<string>} columns The columns of the data frame.
   * @param {QvdMetadata|null} metadata The metadata from the QVD file header (optional).
   */
  constructor(data, columns, metadata = null) {
    this._data = data;
    this._columns = columns;
    this._metadata = metadata;
  }

  /**
   * Returns the data of the data frame.
   */
  get data() {
    return this._data;
  }

  /**
   * Returns the columns of the data frame.
   */
  get columns() {
    return this._columns;
  }

  /**
   * Returns the shape of the data frame.
   */
  get shape() {
    return [this._data.length, this._columns.length];
  }

  /**
   * Returns the complete metadata object from the QVD file header.
   * @return {Object|null} The complete metadata object or null if not available.
   */
  get metadata() {
    return this._metadata;
  }

  /**
   * Returns file-level metadata from the QVD header.
   * @return {Object} File-level metadata properties.
   */
  get fileMetadata() {
    if (!this._metadata) {
      return {};
    }

    const header = this._metadata;
    return {
      qvBuildNo: header.QvBuildNo,
      creatorDoc: header.CreatorDoc,
      createUtcTime: header.CreateUtcTime,
      sourceCreateUtcTime: header.SourceCreateUtcTime,
      sourceFileUtcTime: header.SourceFileUtcTime,
      sourceFileSize: header.SourceFileSize,
      staleUtcTime: header.StaleUtcTime,
      tableName: header.TableName,
      noOfRecords: header.NoOfRecords,
      recordByteSize: header.RecordByteSize,
      offset: header.Offset,
      length: header.Length,
      compression: header.Compression,
      comment: header.Comment,
      encryptionInfo: header.EncryptionInfo,
      tableTags: header.TableTags,
      profilingData: header.ProfilingData,
      lineage: header.Lineage,
    };
  }

  /**
   * Returns field-level metadata for a specific field/column.
   * @param {string} fieldName The name of the field.
   * @return {Object|null} Field metadata or null if field not found.
   */
  getFieldMetadata(fieldName) {
    if (!this._metadata || !this._metadata.Fields || !this._metadata.Fields.QvdFieldHeader) {
      return null;
    }

    let fields = this._metadata.Fields.QvdFieldHeader;
    if (!Array.isArray(fields)) {
      fields = [fields];
    }

    const field = fields.find((f) => f.FieldName === fieldName);
    if (!field) {
      return null;
    }

    return {
      fieldName: field.FieldName,
      bitOffset: field.BitOffset,
      bitWidth: field.BitWidth,
      bias: field.Bias,
      noOfSymbols: field.NoOfSymbols,
      offset: field.Offset,
      length: field.Length,
      comment: field.Comment,
      numberFormat: field.NumberFormat,
      tags: field.Tags,
    };
  }

  /**
   * Returns field-level metadata for all fields.
   * @return {Array<Object>} Array of field metadata objects.
   */
  getAllFieldMetadata() {
    if (!this._metadata || !this._metadata.Fields || !this._metadata.Fields.QvdFieldHeader) {
      return [];
    }

    let fields = this._metadata.Fields.QvdFieldHeader;
    if (!Array.isArray(fields)) {
      fields = [fields];
    }

    return fields.map((field) => ({
      fieldName: field.FieldName,
      bitOffset: field.BitOffset,
      bitWidth: field.BitWidth,
      bias: field.Bias,
      noOfSymbols: field.NoOfSymbols,
      offset: field.Offset,
      length: field.Length,
      comment: field.Comment,
      numberFormat: field.NumberFormat,
      tags: field.Tags,
    }));
  }

  /**
   * @typedef {Object} FileMetadataUpdate
   * @property {string|number} [qvBuildNo] - QlikView build number
   * @property {string} [creatorDoc] - Creator document
   * @property {string} [createUtcTime] - Creation UTC time
   * @property {string} [sourceCreateUtcTime] - Source creation UTC time
   * @property {string} [sourceFileUtcTime] - Source file UTC time
   * @property {string|number} [sourceFileSize] - Source file size
   * @property {string} [staleUtcTime] - Stale UTC time
   * @property {string} [tableName] - Table name
   * @property {string} [compression] - Compression type
   * @property {string} [comment] - Comment
   * @property {string} [encryptionInfo] - Encryption info
   * @property {string} [tableTags] - Table tags
   * @property {string} [profilingData] - Profiling data
   * @property {Object|string} [lineage] - Lineage
   */

  /**
   * Sets modifiable file-level metadata. Immutable properties related to data storage are ignored.
   * @param {FileMetadataUpdate} metadata Object containing metadata properties to update.
   */
  setFileMetadata(metadata) {
    if (!this._metadata) {
      // Initialize metadata structure if it doesn't exist
      this._metadata = {
        QvBuildNo: 50667,
        CreatorDoc: '',
        CreateUtcTime: '',
        SourceCreateUtcTime: '',
        SourceFileUtcTime: '',
        SourceFileSize: -1,
        StaleUtcTime: '',
        TableName: '',
        Fields: {
          QvdFieldHeader: this._columns.map((column) => ({
            FieldName: column,
            BitOffset: 0,
            BitWidth: 0,
            Bias: 0,
            NoOfSymbols: 0,
            Offset: 0,
            Length: 0,
            Comment: '',
            NumberFormat: {
              Type: 'UNKNOWN',
              nDec: '0',
              UseThou: '0',
              Fmt: '',
              Dec: '',
              Thou: '',
            },
            Tags: {},
          })),
        },
        NoOfRecords: 0,
        RecordByteSize: 0,
        Offset: 0,
        Length: 0,
        Compression: '',
        Comment: '',
        EncryptionInfo: '',
        TableTags: '',
        ProfilingData: '',
        Lineage: {},
      };
    }

    // Only allow modification of certain fields (not Offset, Length, NoOfRecords, RecordByteSize)
    const modifiableFields = [
      'qvBuildNo',
      'creatorDoc',
      'createUtcTime',
      'sourceCreateUtcTime',
      'sourceFileUtcTime',
      'sourceFileSize',
      'staleUtcTime',
      'tableName',
      'compression',
      'comment',
      'encryptionInfo',
      'tableTags',
      'profilingData',
      'lineage',
    ];

    // Map camelCase to XML property names
    const fieldMapping = {
      qvBuildNo: 'QvBuildNo',
      creatorDoc: 'CreatorDoc',
      createUtcTime: 'CreateUtcTime',
      sourceCreateUtcTime: 'SourceCreateUtcTime',
      sourceFileUtcTime: 'SourceFileUtcTime',
      sourceFileSize: 'SourceFileSize',
      staleUtcTime: 'StaleUtcTime',
      tableName: 'TableName',
      compression: 'Compression',
      comment: 'Comment',
      encryptionInfo: 'EncryptionInfo',
      tableTags: 'TableTags',
      profilingData: 'ProfilingData',
      lineage: 'Lineage',
    };

    modifiableFields.forEach((field) => {
      // @ts-ignore - Dynamic property access for metadata mapping
      if (metadata[field] !== undefined) {
        // @ts-ignore - Dynamic property access for metadata mapping
        this._metadata[fieldMapping[field]] = metadata[field];
      }
    });
  }

  /**
   * @typedef {Object} FieldMetadataUpdate
   * @property {string} [comment] - Field comment
   * @property {QvdNumberFormat|string} [numberFormat] - Number format
   * @property {Object|string} [tags] - Field tags
   */

  /**
   * Sets modifiable field-level metadata for a specific field.
   * Immutable properties related to data storage (Offset, Length, BitOffset, etc.) are ignored.
   * @param {string} fieldName The name of the field.
   * @param {FieldMetadataUpdate} metadata Object containing field metadata properties to update.
   */
  setFieldMetadata(fieldName, metadata) {
    if (!this._metadata || !this._metadata.Fields || !this._metadata.Fields.QvdFieldHeader) {
      return;
    }

    let fields = this._metadata.Fields.QvdFieldHeader;
    if (!Array.isArray(fields)) {
      fields = [fields];
      this._metadata.Fields.QvdFieldHeader = fields;
    }

    const fieldIndex = fields.findIndex((f) => f.FieldName === fieldName);
    if (fieldIndex === -1) {
      return;
    }

    // Only allow modification of Comment, NumberFormat, and Tags (not Offset, Length, BitOffset, etc.)
    if (metadata.comment !== undefined) {
      fields[fieldIndex].Comment = metadata.comment;
    }
    if (metadata.numberFormat !== undefined) {
      fields[fieldIndex].NumberFormat = metadata.numberFormat;
    }
    if (metadata.tags !== undefined) {
      fields[fieldIndex].Tags = metadata.tags;
    }
  }

  /**
   * Returns the first n rows of the data frame.
   *
   * @param {number} n The number of rows to return.
   * @return {QvdDataFrame} The first n rows of the data frame.
   * @throws {QvdValidationError} If n is not a non-negative integer.
   */
  head(n = 5) {
    if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
      throw new QvdValidationError('head() requires a non-negative integer', {
        provided: n,
        type: typeof n,
      });
    }
    return new QvdDataFrame(this._data.slice(0, n), this._columns, this._metadata);
  }

  /**
   * Returns the last n rows of the data frame.
   *
   * @param {number} n The number of rows to return.
   * @return {QvdDataFrame} The first n rows of the data frame.
   * @throws {QvdValidationError} If n is not a non-negative integer.
   */
  tail(n = 5) {
    if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
      throw new QvdValidationError('tail() requires a non-negative integer', {
        provided: n,
        type: typeof n,
      });
    }
    return new QvdDataFrame(n === 0 ? [] : this._data.slice(-n), this._columns, this._metadata);
  }

  /**
   * Returns the selected rows of the data frame.
   *
   * @param  {...number} args The indices of the rows to return.
   * @return {QvdDataFrame} The selected rows of the data frame.
   * @throws {QvdValidationError} If any index is not an integer or is out of bounds.
   */
  rows(...args) {
    for (const index of args) {
      if (typeof index !== 'number' || !Number.isInteger(index)) {
        throw new QvdValidationError('rows() requires integer indices', {
          provided: index,
          type: typeof index,
        });
      }
      if (index < 0 || index >= this._data.length) {
        throw new QvdValidationError(`Row index ${index} out of bounds`, {
          index,
          validRange: [0, this._data.length - 1],
          dataLength: this._data.length,
        });
      }
    }
    return new QvdDataFrame(
      args.map((index) => this._data[index]),
      this._columns,
      this._metadata,
    );
  }

  /**
   * Returns the value at the specified row and column.
   *
   * @param {number} row The index of the row.
   * @param {string} column The name of the column.
   * @return {any} The value at the specified row and column.
   * @throws {QvdValidationError} If row is not an integer, out of bounds, or column does not exist.
   */
  at(row, column) {
    if (typeof row !== 'number' || !Number.isInteger(row)) {
      throw new QvdValidationError('Row index must be an integer', {
        provided: row,
        type: typeof row,
      });
    }
    if (row < 0 || row >= this._data.length) {
      throw new QvdValidationError(`Row index ${row} out of bounds`, {
        index: row,
        validRange: [0, this._data.length - 1],
        dataLength: this._data.length,
      });
    }
    if (!this._columns.includes(column)) {
      throw new QvdValidationError(`Column '${column}' does not exist`, {
        column,
        availableColumns: this._columns,
      });
    }
    return this._data[row][this._columns.indexOf(column)];
  }

  /**
   * Selects the specified columns from the data frame.
   *
   * @param  {...string} args The names of the columns to select.
   * @return {QvdDataFrame} The selected columns of the data frame.
   * @throws {QvdValidationError} If any column name does not exist.
   */
  select(...args) {
    for (const column of args) {
      if (!this._columns.includes(column)) {
        throw new QvdValidationError(`Column '${column}' does not exist`, {
          column,
          availableColumns: this._columns,
        });
      }
    }
    const indices = args.map((arg) => this._columns.indexOf(arg));
    const data = this._data.map((row) => indices.map((index) => row[index]));
    const columns = indices.map((index) => this._columns[index]);
    return new QvdDataFrame(data, columns, this._metadata);
  }

  /**
   * Returns the data frame as a dictionary.
   *
   * @return {Promise<{columns: Array<string>, data: Array<Array<any>>}>} The data frame as a dictionary.
   */
  async toDict() {
    return {columns: this._columns, data: this._data};
  }

  /**
   * Persists the data frame to a QVD file.
   *
   * @param {string} path The path to the QVD file.
   * @param {Object} [options] Optional writing options.
   * @param {string} [options.allowedDir] Optional allowed directory path. If provided, the file path must be within this directory.
   */
  async toQvd(path, options = {}) {
    const {QvdFileWriter} = await import('./QvdFileWriter.js');
    const writerOptions = {allowedDir: options.allowedDir};
    await new QvdFileWriter(path, this, writerOptions).save();
  }

  /**
   * Loads a QVD file and returns its data frame.
   *
   * @param {string} path The path to the QVD file.
   * @param {Object} [options] Optional loading options.
   * @param {number|null} [options.maxRows] The maximum number of rows to load. If not specified, all rows are loaded.
   * @param {string} [options.allowedDir] Optional allowed directory path. If provided, the file path must be within this directory.
   * @return {Promise<QvdDataFrame>} The data frame of the QVD file.
   */
  static async fromQvd(path, options = {}) {
    const {QvdFileReader} = await import('./QvdFileReader.js');
    const readerOptions = {allowedDir: options.allowedDir};
    return await new QvdFileReader(path, readerOptions).load(options.maxRows !== undefined ? options.maxRows : null);
  }

  /**
   * Constructs a data frame from a dictionary.
   *
   * @param {{columns: Array<string>, data: Array<Array<any>>}} data The dictionary to construct the data frame from.
   * @return {Promise<QvdDataFrame>} The constructed data frame.
   */
  static async fromDict(data) {
    if (!data.columns) {
      throw new QvdValidationError('The dictionary to construct the data frame from does not contain any columns.', {
        data,
      });
    }
    if (!data.data) {
      throw new QvdValidationError('The dictionary to construct the data frame from does not contain any data.', {
        data,
      });
    }

    return new QvdDataFrame(data.data, data.columns);
  }
}
