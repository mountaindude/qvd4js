// @ts-check

import assert from 'assert';

/**
 * Represents a loaded QVD file.
 */
export class QvdDataFrame {
  /**
   * Represents the data frame stored inside a QVD file.
   * @param {Array<Array<any>>} data The data of the data frame.
   * @param {Array<string>} columns The columns of the data frame.
   * @param {Object|null} metadata The metadata from the QVD file header (optional).
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
   * Sets modifiable file-level metadata. Immutable properties related to data storage are ignored.
   * @param {Object} metadata Object containing metadata properties to update.
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
      if (metadata[field] !== undefined) {
        this._metadata[fieldMapping[field]] = metadata[field];
      }
    });
  }

  /**
   * Sets modifiable field-level metadata for a specific field.
   * Immutable properties related to data storage (Offset, Length, BitOffset, etc.) are ignored.
   * @param {string} fieldName The name of the field.
   * @param {Object} metadata Object containing field metadata properties to update.
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
   */
  head(n = 5) {
    return new QvdDataFrame(this._data.slice(0, n), this._columns, this._metadata);
  }

  /**
   * Returns the last n rows of the data frame.
   *
   * @param {number} n The number of rows to return.
   * @return {QvdDataFrame} The first n rows of the data frame.
   */
  tail(n = 5) {
    return new QvdDataFrame(this._data.slice(-n), this._columns, this._metadata);
  }

  /**
   * Returns the selected rows of the data frame.
   *
   * @param  {...number} args The indices of the rows to return.
   * @return {QvdDataFrame} The selected rows of the data frame.
   */
  rows(...args) {
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
   */
  at(row, column) {
    return this._data[row][this._columns.indexOf(column)];
  }

  /**
   * Selects the specified columns from the data frame.
   *
   * @param  {...string} args The names of the columns to select.
   * @return {QvdDataFrame} The selected columns of the data frame.
   */
  select(...args) {
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
   */
  async toQvd(path) {
    const {QvdFileWriter} = await import('./QvdFileWriter.js');
    new QvdFileWriter(path, this).save();
  }

  /**
   * Loads a QVD file and returns its data frame.
   *
   * @param {string} path The path to the QVD file.
   * @return {Promise<QvdDataFrame>} The data frame of the QVD file.
   */
  static async fromQvd(path) {
    const {QvdFileReader} = await import('./QvdFileReader.js');
    return await new QvdFileReader(path).load();
  }

  /**
   * Constructs a data frame from a dictionary.
   *
   * @param {{columns: Array<string>, data: Array<Array<any>>}} data The dictionary to construct the data frame from.
   * @return {Promise<QvdDataFrame>} The constructed data frame.
   */
  static async fromDict(data) {
    assert(data.columns, 'The dictionary to construct the data frame from does not contain any columns.');
    assert(data.data, 'The dictionary to construct the data frame from does not contain any data.');

    return new QvdDataFrame(data.data, data.columns);
  }
}
