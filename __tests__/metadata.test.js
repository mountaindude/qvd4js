import path from 'path';
import fs from 'fs';
import {QvdDataFrame} from '../src';
import {getDirname} from './test-utils.js';

const __dirname = getDirname(import.meta.url);

describe('QVD Metadata Access', () => {
  test('Should expose file-level metadata after loading QVD', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    expect(df).toBeDefined();
    expect(df.metadata).toBeDefined();
    expect(df.fileMetadata).toBeDefined();

    const fileMetadata = df.fileMetadata;
    expect(fileMetadata.qvBuildNo).toBeDefined();
    expect(fileMetadata.creatorDoc).toBeDefined();
    expect(fileMetadata.createUtcTime).toBeDefined();
    expect(fileMetadata.tableName).toBe('Products');
    expect(fileMetadata.noOfRecords).toBe('606');
  });

  test('Should expose field-level metadata for specific fields', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    const fieldMetadata = df.getFieldMetadata('ProductKey');
    expect(fieldMetadata).toBeDefined();
    expect(fieldMetadata.fieldName).toBe('ProductKey');
    expect(fieldMetadata.bitOffset).toBeDefined();
    expect(fieldMetadata.bitWidth).toBeDefined();
    expect(fieldMetadata.noOfSymbols).toBeDefined();
    expect(fieldMetadata.numberFormat).toBeDefined();
  });

  test('Should return null for non-existent field', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    const fieldMetadata = df.getFieldMetadata('NonExistentField');
    expect(fieldMetadata).toBeNull();
  });

  test('Should expose all field metadata', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    const allFieldMetadata = df.getAllFieldMetadata();
    expect(allFieldMetadata).toBeDefined();
    expect(Array.isArray(allFieldMetadata)).toBe(true);
    expect(allFieldMetadata.length).toBe(8);
    expect(allFieldMetadata[0].fieldName).toBe('ProductKey');
  });

  test('Should preserve metadata in head(), tail(), rows(), and select()', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    const headDf = df.head(5);
    expect(headDf.metadata).toBeDefined();
    expect(headDf.fileMetadata.tableName).toBe('Products');

    const tailDf = df.tail(5);
    expect(tailDf.metadata).toBeDefined();
    expect(tailDf.fileMetadata.tableName).toBe('Products');

    const rowsDf = df.rows(0, 1, 2);
    expect(rowsDf.metadata).toBeDefined();
    expect(rowsDf.fileMetadata.tableName).toBe('Products');

    const selectDf = df.select('ProductKey', 'ProductName');
    expect(selectDf.metadata).toBeDefined();
    expect(selectDf.fileMetadata.tableName).toBe('Products');
  });

  test('Should handle QVD with single field', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    // Select a single column to create a scenario similar to single field
    const singleFieldDf = df.select('ProductKey');
    const fieldMetadata = singleFieldDf.getFieldMetadata('ProductKey');
    expect(fieldMetadata).toBeDefined();
    expect(fieldMetadata.fieldName).toBe('ProductKey');
  });
});

describe('QVD Metadata Modification', () => {
  test('Should allow modifying file-level metadata', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    df.setFileMetadata({
      tableName: 'ModifiedProducts',
      comment: 'This is a test comment',
    });

    const fileMetadata = df.fileMetadata;
    expect(fileMetadata.tableName).toBe('ModifiedProducts');
    expect(fileMetadata.comment).toBe('This is a test comment');
  });

  test('Should not allow modifying immutable file-level properties', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    const originalNoOfRecords = df.fileMetadata.noOfRecords;
    const originalOffset = df.fileMetadata.offset;

    // Try to modify immutable properties (should be ignored)
    df.setFileMetadata({
      noOfRecords: 999,
      offset: 12345,
      length: 67890,
    });

    const fileMetadata = df.fileMetadata;
    expect(fileMetadata.noOfRecords).toBe(originalNoOfRecords);
    expect(fileMetadata.offset).toBe(originalOffset);
  });

  test('Should allow modifying field-level metadata', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    df.setFieldMetadata('ProductKey', {
      comment: 'This is the product key',
      tags: {String: ['$key', '$primary']},
    });

    const fieldMetadata = df.getFieldMetadata('ProductKey');
    expect(fieldMetadata.comment).toBe('This is the product key');
    // Tags are stored as-is in memory, only xml2js parsing affects the structure
    expect(fieldMetadata.tags).toEqual({String: ['$key', '$primary']});
  });

  test('Should not allow modifying immutable field-level properties', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    const originalOffset = df.getFieldMetadata('ProductKey').offset;
    const originalBitWidth = df.getFieldMetadata('ProductKey').bitWidth;

    // Try to modify immutable properties (should be ignored)
    df.setFieldMetadata('ProductKey', {
      offset: 99999,
      bitWidth: 32,
      length: 12345,
    });

    const fieldMetadata = df.getFieldMetadata('ProductKey');
    expect(fieldMetadata.offset).toBe(originalOffset);
    expect(fieldMetadata.bitWidth).toBe(originalBitWidth);
  });
});

describe('QVD Metadata Persistence', () => {
  const testFile = path.join(__dirname, 'data/metadata_test.qvd');

  afterEach(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  test('Should persist modified metadata when writing QVD', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    // Modify metadata
    df.setFileMetadata({
      tableName: 'TestProducts',
      comment: 'Test comment for persistence',
    });

    df.setFieldMetadata('ProductKey', {
      comment: 'Primary key field',
      tags: {String: ['$key']},
    });

    // Write to new file
    await df.toQvd(testFile);

    // Read back and verify
    const loadedDf = await QvdDataFrame.fromQvd(testFile);
    expect(loadedDf.fileMetadata.tableName).toBe('TestProducts');
    expect(loadedDf.fileMetadata.comment).toBe('Test comment for persistence');

    const fieldMetadata = loadedDf.getFieldMetadata('ProductKey');
    expect(fieldMetadata.comment).toBe('Primary key field');
    // xml2js converts single-element arrays to strings when explicitArray: false
    expect(fieldMetadata.tags).toEqual({String: '$key'});
  });

  test('Should create default metadata for new data frames', async () => {
    const rawDf = {
      columns: ['Key', 'Value'],
      data: [
        [1, 'A'],
        [2, 'B'],
        [3, 'C'],
      ],
    };

    const df = await QvdDataFrame.fromDict(rawDf);

    // Data frame from dict should have no metadata initially
    expect(df.metadata).toBeNull();
    expect(df.fileMetadata).toEqual({});

    // Set some metadata
    df.setFileMetadata({
      tableName: 'NewTable',
      comment: 'Created from dict',
    });

    // Write and read back
    await df.toQvd(testFile);
    const loadedDf = await QvdDataFrame.fromQvd(testFile);

    expect(loadedDf.fileMetadata.tableName).toBe('NewTable');
    expect(loadedDf.fileMetadata.comment).toBe('Created from dict');
  });

  test('Should preserve NumberFormat when writing', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    const originalNumberFormat = df.getFieldMetadata('ProductKey').numberFormat;

    // Write to new file
    await df.toQvd(testFile);

    // Read back and verify NumberFormat is preserved
    const loadedDf = await QvdDataFrame.fromQvd(testFile);
    const newNumberFormat = loadedDf.getFieldMetadata('ProductKey').numberFormat;

    expect(newNumberFormat).toEqual(originalNumberFormat);
  });

  test('Should preserve Tags when writing', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    // Set custom tags with multiple values
    df.setFieldMetadata('ProductKey', {
      tags: {String: ['$numeric', '$integer', '$key']},
    });

    // Write to new file
    await df.toQvd(testFile);

    // Read back and verify Tags are preserved
    const loadedDf = await QvdDataFrame.fromQvd(testFile);
    const fieldMetadata = loadedDf.getFieldMetadata('ProductKey');

    // xml2js preserves arrays when there are multiple elements
    expect(fieldMetadata.tags).toEqual({String: ['$numeric', '$integer', '$key']});
  });
});
