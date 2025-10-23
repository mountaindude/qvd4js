import fs from 'fs';
import {QvdDataFrame} from '../src';

describe('Performance improvements', () => {
  const testPath = '__tests__/data/performance-test.qvd';

  afterEach(() => {
    if (fs.existsSync(testPath)) {
      fs.unlinkSync(testPath);
    }
  });

  test('Handles large dataset with many unique values efficiently', async () => {
    // Create a dataset with 10K rows and 10 columns with high cardinality
    const numRows = 10000;
    const numCols = 10;
    const columns = Array.from({length: numCols}, (_, i) => `Col${i}`);
    const data = Array.from({length: numRows}, (_, i) => Array.from({length: numCols}, (_, j) => `Value${i}_${j}`));

    const rawDf = {columns, data};
    const df = await QvdDataFrame.fromDict(rawDf);

    const startTime = Date.now();
    await df.toQvd(testPath);
    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(fs.existsSync(testPath)).toBe(true);
    expect(fs.statSync(testPath).size).toBeGreaterThan(0);

    // This should complete in reasonable time (under 10 seconds even in CI)
    // The optimized version should be much faster than the old O(n×m×s) implementation
    expect(duration).toBeLessThan(10000);
  }, 15000); // 15 second timeout

  test('Progress callback works correctly with large dataset', async () => {
    // Create a moderately large dataset to test progress reporting
    const numRows = 5000;
    const rawDf = {
      columns: ['ID', 'Name', 'Value', 'Category', 'Status'],
      data: Array.from({length: numRows}, (_, i) => [
        i,
        `Name${i % 100}`,
        Math.random() * 1000,
        `Category${i % 20}`,
        i % 2 === 0 ? 'Active' : 'Inactive',
      ]),
    };

    const df = await QvdDataFrame.fromDict(rawDf);

    const progressEvents = [];
    const startTime = Date.now();

    await df.toQvd(testPath, {
      onProgress: (progress) => {
        progressEvents.push({...progress, timestamp: Date.now()});
      },
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(fs.existsSync(testPath)).toBe(true);

    // Verify we got progress updates
    expect(progressEvents.length).toBeGreaterThan(0);

    // Verify all stages completed
    const stages = new Set(progressEvents.map((e) => e.stage));
    expect(stages.has('symbol-table')).toBe(true);
    expect(stages.has('index-table')).toBe(true);
    expect(stages.has('header')).toBe(true);
    expect(stages.has('write')).toBe(true);

    // Verify each stage reaches 100%
    const symbolTableComplete = progressEvents.some((e) => e.stage === 'symbol-table' && e.percent === 100);
    const indexTableComplete = progressEvents.some((e) => e.stage === 'index-table' && e.percent === 100);
    const headerComplete = progressEvents.some((e) => e.stage === 'header' && e.percent === 100);
    const writeComplete = progressEvents.some((e) => e.stage === 'write' && e.percent === 100);

    expect(symbolTableComplete).toBe(true);
    expect(indexTableComplete).toBe(true);
    expect(headerComplete).toBe(true);
    expect(writeComplete).toBe(true);

    // Should complete in reasonable time
    expect(duration).toBeLessThan(10000);
  }, 15000); // 15 second timeout

  test('Correctly processes dataset with null values using optimized code', async () => {
    const rawDf = {
      columns: ['ID', 'Value', 'Description'],
      data: [
        [1, 'A', 'First'],
        [2, null, 'Second'],
        [3, 'C', null],
        [null, 'D', 'Fourth'],
        [5, null, null],
      ],
    };

    const df = await QvdDataFrame.fromDict(rawDf);
    await df.toQvd(testPath);

    expect(fs.existsSync(testPath)).toBe(true);

    // Verify the written file can be read back correctly
    const readDf = await QvdDataFrame.fromQvd(testPath);
    expect(readDf.shape).toEqual([5, 3]);
    expect(readDf.columns).toEqual(['ID', 'Value', 'Description']);

    // Verify null values are preserved
    expect(readDf.at(1, 'Value')).toBeNull();
    expect(readDf.at(2, 'Description')).toBeNull();
    expect(readDf.at(3, 'ID')).toBeNull();
    expect(readDf.at(4, 'Value')).toBeNull();
    expect(readDf.at(4, 'Description')).toBeNull();
  });

  test('Map-based lookup produces identical results to findIndex', async () => {
    // Test with a variety of data types to ensure correctness
    const rawDf = {
      columns: ['Integer', 'Float', 'String', 'Mixed'],
      data: [
        [1, 1.5, 'A', 100],
        [2, 2.5, 'B', 'Text'],
        [1, 1.5, 'A', 100], // Duplicate of first row
        [3, 3.5, 'C', 300],
        [2, 2.5, 'B', 'Text'], // Duplicate of second row
      ],
    };

    const df = await QvdDataFrame.fromDict(rawDf);
    await df.toQvd(testPath);

    expect(fs.existsSync(testPath)).toBe(true);

    // Verify the written file can be read back correctly
    const readDf = await QvdDataFrame.fromQvd(testPath);
    expect(readDf.shape).toEqual([5, 4]);

    // Verify all values match
    for (let i = 0; i < readDf.shape[0]; i++) {
      for (let j = 0; j < readDf.columns.length; j++) {
        expect(readDf.at(i, readDf.columns[j])).toEqual(rawDf.data[i][j]);
      }
    }
  });

  test('Optimized symbol table building produces correct results', async () => {
    // Test that the single-pass optimization produces correct results
    const rawDf = {
      columns: ['A', 'B', 'C'],
      data: [
        [1, 10, 100],
        [2, 10, 200],
        [1, 20, 100],
        [3, 10, 300],
      ],
    };

    const df = await QvdDataFrame.fromDict(rawDf);
    await df.toQvd(testPath);

    expect(fs.existsSync(testPath)).toBe(true);

    // Read back and verify
    const readDf = await QvdDataFrame.fromQvd(testPath);
    expect(readDf.shape).toEqual(df.shape);

    // Verify all data matches
    for (let i = 0; i < readDf.shape[0]; i++) {
      for (let j = 0; j < readDf.columns.length; j++) {
        expect(readDf.at(i, readDf.columns[j])).toEqual(df.at(i, df.columns[j]));
      }
    }
  });
});
