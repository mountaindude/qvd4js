import fs from 'fs';
import {QvdDataFrame} from '../src';

describe('Progress callbacks', () => {
  const testPath = '__tests__/data/progress-test.qvd';

  afterEach(() => {
    if (fs.existsSync(testPath)) {
      fs.unlinkSync(testPath);
    }
  });

  test('Progress callback is called with correct stages', async () => {
    const rawDf = {
      columns: ['Key', 'Value', 'Description'],
      data: Array.from({length: 100}, (_, i) => [i, `Value${i}`, `Desc${i}`]),
    };

    const df = await QvdDataFrame.fromDict(rawDf);

    const progressEvents = [];
    await df.toQvd(testPath, {
      onProgress: (progress) => {
        progressEvents.push(progress);
      },
    });

    expect(fs.existsSync(testPath)).toBe(true);

    // Verify that all expected stages are present
    const stages = progressEvents.map((e) => e.stage);
    expect(stages).toContain('symbol-table');
    expect(stages).toContain('index-table');
    expect(stages).toContain('header');
    expect(stages).toContain('write');

    // Verify progress structure
    progressEvents.forEach((event) => {
      expect(event).toHaveProperty('stage');
      expect(event).toHaveProperty('current');
      expect(event).toHaveProperty('total');
      expect(event).toHaveProperty('percent');
      expect(typeof event.stage).toBe('string');
      expect(typeof event.current).toBe('number');
      expect(typeof event.total).toBe('number');
      expect(typeof event.percent).toBe('number');
      expect(event.percent).toBeGreaterThanOrEqual(0);
      expect(event.percent).toBeLessThanOrEqual(100);
    });
  });

  test('Progress callback reports incremental progress for large datasets', async () => {
    const rawDf = {
      columns: ['ID', 'Name', 'Value'],
      data: Array.from({length: 1000}, (_, i) => [i, `Name${i}`, Math.random() * 100]),
    };

    const df = await QvdDataFrame.fromDict(rawDf);

    const progressEvents = [];
    await df.toQvd(testPath, {
      onProgress: (progress) => {
        progressEvents.push(progress);
      },
    });

    // Check that index-table stage has multiple progress updates
    const indexTableEvents = progressEvents.filter((e) => e.stage === 'index-table');
    expect(indexTableEvents.length).toBeGreaterThan(1);

    // Verify that progress increases monotonically for index-table stage
    for (let i = 1; i < indexTableEvents.length; i++) {
      expect(indexTableEvents[i].current).toBeGreaterThanOrEqual(indexTableEvents[i - 1].current);
    }

    // Verify last index-table event shows completion
    const lastIndexEvent = indexTableEvents[indexTableEvents.length - 1];
    expect(lastIndexEvent.current).toBe(lastIndexEvent.total);
    expect(lastIndexEvent.percent).toBe(100);
  });

  test('Progress callback for symbol-table stage reports per-column progress', async () => {
    const rawDf = {
      columns: ['Col1', 'Col2', 'Col3', 'Col4', 'Col5'],
      data: Array.from({length: 50}, (_, i) => [i % 10, i % 20, i % 30, i % 40, i % 50]),
    };

    const df = await QvdDataFrame.fromDict(rawDf);

    const progressEvents = [];
    await df.toQvd(testPath, {
      onProgress: (progress) => {
        progressEvents.push(progress);
      },
    });

    // Check symbol-table stage
    const symbolTableEvents = progressEvents.filter((e) => e.stage === 'symbol-table');
    expect(symbolTableEvents.length).toBeGreaterThanOrEqual(5); // At least start + 5 columns

    // Verify completion
    const lastSymbolEvent = symbolTableEvents[symbolTableEvents.length - 1];
    expect(lastSymbolEvent.current).toBe(5); // 5 columns
    expect(lastSymbolEvent.total).toBe(5);
    expect(lastSymbolEvent.percent).toBe(100);
  });

  test('Works without progress callback (backward compatibility)', async () => {
    const rawDf = {
      columns: ['Key', 'Value'],
      data: [
        [1, 'A'],
        [2, 'B'],
      ],
    };

    const df = await QvdDataFrame.fromDict(rawDf);

    // Should work without onProgress callback
    await expect(df.toQvd(testPath)).resolves.not.toThrow();
    expect(fs.existsSync(testPath)).toBe(true);
  });

  test('Progress callback with empty dataset', async () => {
    const rawDf = {
      columns: ['Key', 'Value'],
      data: [],
    };

    const df = await QvdDataFrame.fromDict(rawDf);

    const progressEvents = [];
    await df.toQvd(testPath, {
      onProgress: (progress) => {
        progressEvents.push(progress);
      },
    });

    expect(fs.existsSync(testPath)).toBe(true);

    // Should still report progress for all stages
    const stages = progressEvents.map((e) => e.stage);
    expect(stages).toContain('symbol-table');
    expect(stages).toContain('index-table');
    expect(stages).toContain('header');
    expect(stages).toContain('write');
  });

  test('Progress callback with single row dataset', async () => {
    const rawDf = {
      columns: ['Key', 'Value'],
      data: [[1, 'A']],
    };

    const df = await QvdDataFrame.fromDict(rawDf);

    const progressEvents = [];
    await df.toQvd(testPath, {
      onProgress: (progress) => {
        progressEvents.push(progress);
      },
    });

    expect(fs.existsSync(testPath)).toBe(true);

    // Verify all stages completed
    const stages = progressEvents.map((e) => e.stage);
    expect(stages).toContain('symbol-table');
    expect(stages).toContain('index-table');
    expect(stages).toContain('header');
    expect(stages).toContain('write');

    // Each stage should report 100% at some point
    const symbolTableEvents = progressEvents.filter((e) => e.stage === 'symbol-table');
    const indexTableEvents = progressEvents.filter((e) => e.stage === 'index-table');
    const headerEvents = progressEvents.filter((e) => e.stage === 'header');
    const writeEvents = progressEvents.filter((e) => e.stage === 'write');

    expect(symbolTableEvents.some((e) => e.percent === 100)).toBe(true);
    expect(indexTableEvents.some((e) => e.percent === 100)).toBe(true);
    expect(headerEvents.some((e) => e.percent === 100)).toBe(true);
    expect(writeEvents.some((e) => e.percent === 100)).toBe(true);
  });
});
