import path from 'path';
import {QvdDataFrame} from '../src';
import {getDirname} from './test-utils.js';

const __dirname = getDirname(import.meta.url);

describe('Lazy loading of QVD files', () => {
  test('Loading a QVD file with maxRows should only load specified rows', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'), {maxRows: 10});

    expect(df).toBeDefined();
    expect(df.shape).toBeDefined();
    expect(df.shape[0]).toBe(10); // Should have only 10 rows
    expect(df.shape[1]).toBe(8); // Should have all 8 columns
    expect(df.columns).toBeDefined();
    expect(df.columns.length).toBe(8);
    expect(df.data).toBeDefined();
    expect(df.data.length).toBe(10);
  });

  test('Loading a QVD file with maxRows=0 should return empty dataframe', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'), {maxRows: 0});

    expect(df).toBeDefined();
    expect(df.shape[0]).toBe(0);
    expect(df.shape[1]).toBe(8);
    expect(df.data.length).toBe(0);
  });

  test('Loading a QVD file with maxRows=1 should return single row', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'), {maxRows: 1});

    expect(df).toBeDefined();
    expect(df.shape[0]).toBe(1);
    expect(df.shape[1]).toBe(8);
    expect(df.data.length).toBe(1);
  });

  test('Loading with maxRows larger than file should load all rows', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'), {maxRows: 10000});

    expect(df).toBeDefined();
    expect(df.shape[0]).toBe(606); // All rows from small.qvd
    expect(df.shape[1]).toBe(8);
  });

  test('Loading without maxRows should load all rows (backward compatibility)', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    expect(df).toBeDefined();
    expect(df.shape[0]).toBe(606); // All rows
    expect(df.shape[1]).toBe(8);
  });

  test('Loading with maxRows should preserve metadata', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'), {maxRows: 10});

    expect(df.metadata).toBeDefined();
    expect(df.fileMetadata).toBeDefined();
    expect(df.columns).toBeDefined();
    expect(df.columns.length).toBe(8);
  });

  test('Loading with maxRows should allow selection of columns', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'), {maxRows: 10});
    const firstColumn = df.columns[0];
    const selected = df.select(firstColumn);

    expect(selected).toBeDefined();
    expect(selected.shape[0]).toBe(10);
    expect(selected.shape[1]).toBe(1);
  });

  test('Loading with maxRows should work with head() method', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'), {maxRows: 10});
    const head = df.head(5);

    expect(head).toBeDefined();
    expect(head.shape[0]).toBe(5);
    expect(head.shape[1]).toBe(8);
  });

  test('Loading with maxRows should work with tail() method', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'), {maxRows: 10});
    const tail = df.tail(3);

    expect(tail).toBeDefined();
    expect(tail.shape[0]).toBe(3);
    expect(tail.shape[1]).toBe(8);
  });

  test('Loading with maxRows should work with rows() method', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'), {maxRows: 10});
    const rows = df.rows(0, 2, 4);

    expect(rows).toBeDefined();
    expect(rows.shape[0]).toBe(3);
    expect(rows.shape[1]).toBe(8);
  });

  test('Loading with maxRows should work with at() method', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'), {maxRows: 10});
    const firstColumn = df.columns[0];
    const value = df.at(0, firstColumn);

    expect(value).toBeDefined();
  });

  test('Loading medium file with maxRows should load correct number of rows', async () => {
    const df1 = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/medium.qvd'), {maxRows: 100});
    const df2 = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/medium.qvd'));

    expect(df1.shape[0]).toBe(100);
    expect(df1.shape[1]).toBe(13);
    expect(df2.shape[0]).toBe(18484);
    expect(df2.shape[1]).toBe(13);
  });

  test('Loading large file with small maxRows should work correctly', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/large.qvd'), {maxRows: 50});

    expect(df).toBeDefined();
    expect(df.shape[0]).toBe(50);
    expect(df.shape[1]).toBe(11);
    expect(df.columns).toBeDefined();
    expect(df.columns.length).toBe(11);
  });
});
