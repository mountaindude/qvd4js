// Test suite to verify that empty QVDs (zero data rows) can be written and read

import {QvdDataFrame} from '../src/QvdDataFrame.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('Empty QVD Support', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'qvd4js-empty-test-'));
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.promises.rm(tempDir, {recursive: true, force: true});
    }
  });

  test('Should create and write an empty QVD with columns but no data rows', async () => {
    const emptyData = [];
    const columns = ['Field1', 'Field2', 'Field3'];
    const df = new QvdDataFrame(emptyData, columns);

    const outputPath = path.join(tempDir, 'empty.qvd');

    // Try to write the empty QVD
    await expect(df.toQvd(outputPath, {allowedDir: tempDir})).resolves.not.toThrow();

    // Verify the file was created
    expect(fs.existsSync(outputPath)).toBe(true);

    // Verify the file is not completely empty (should have XML header)
    const stats = await fs.promises.stat(outputPath);
    expect(stats.size).toBeGreaterThan(0);
  });

  test('Should read back an empty QVD and get correct structure', async () => {
    const emptyData = [];
    const columns = ['Name', 'Age', 'City'];
    const df = new QvdDataFrame(emptyData, columns);

    const outputPath = path.join(tempDir, 'empty-roundtrip.qvd');

    // Write empty QVD
    await df.toQvd(outputPath, {allowedDir: tempDir});

    // Read it back
    const loadedDf = await QvdDataFrame.fromQvd(outputPath, {allowedDir: tempDir});

    // Verify structure
    expect(loadedDf.columns).toEqual(columns);
    expect(loadedDf.data).toEqual([]);
    expect(loadedDf.shape).toEqual([0, 3]);
  });

  test('Empty QVD should have valid XML header with NoOfRecords=0', async () => {
    const emptyData = [];
    const columns = ['Field1'];
    const df = new QvdDataFrame(emptyData, columns);

    const outputPath = path.join(tempDir, 'empty-header-check.qvd');
    await df.toQvd(outputPath, {allowedDir: tempDir});

    // Read the file content
    const content = await fs.promises.readFile(outputPath, 'utf-8');

    // Check for XML header markers
    expect(content).toContain('<QvdTableHeader>');
    expect(content).toContain('<NoOfRecords>0</NoOfRecords>');
    expect(content).toContain('<QvdFieldHeader>');
    expect(content).toContain('<FieldName>Field1</FieldName>');
  });

  test('Empty QVD with metadata should preserve metadata', async () => {
    const emptyData = [];
    const columns = ['TestField'];
    const df = new QvdDataFrame(emptyData, columns);

    // Set some metadata
    df.setFileMetadata({
      tableName: 'EmptyTable',
      comment: 'This is an empty test table',
    });

    const outputPath = path.join(tempDir, 'empty-with-metadata.qvd');
    await df.toQvd(outputPath, {allowedDir: tempDir});

    // Read it back
    const loadedDf = await QvdDataFrame.fromQvd(outputPath, {allowedDir: tempDir});

    expect(loadedDf.fileMetadata.tableName).toBe('EmptyTable');
    expect(loadedDf.fileMetadata.comment).toBe('This is an empty test table');
    expect(loadedDf.data).toEqual([]);
  });

  test('Should read the reference empty QVD from Qlik Sense', async () => {
    const testDataDir = path.join(process.cwd(), '__tests__', 'data');
    const referenceFile = path.join(testDataDir, 'empty_qvd.qvd');

    // Read the reference empty QVD
    const df = await QvdDataFrame.fromQvd(referenceFile, {allowedDir: testDataDir});

    // Verify structure
    expect(df.columns).toEqual(['Country', 'Year', 'Sales']);
    expect(df.data).toEqual([]);
    expect(df.shape).toEqual([0, 3]);
    expect(df.fileMetadata.noOfRecords).toBe('0');
    expect(df.fileMetadata.recordByteSize).toBe('1');
    expect(df.fileMetadata.tableName).toBe('TestTable');
  });
});
