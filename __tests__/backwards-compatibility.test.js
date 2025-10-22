import path from 'path';
import {QvdDataFrame, QvdSymbol, QvdFileReader, QvdFileWriter} from '../src';
import {getDirname} from './test-utils.js';

const __dirname = getDirname(import.meta.url);

describe('Backwards Compatibility Tests', () => {
  test('All classes should be exported from main index', () => {
    expect(QvdDataFrame).toBeDefined();
    expect(QvdSymbol).toBeDefined();
    expect(QvdFileReader).toBeDefined();
    expect(QvdFileWriter).toBeDefined();
  });

  test('QvdSymbol class should have all static factory methods', () => {
    expect(typeof QvdSymbol.fromIntValue).toBe('function');
    expect(typeof QvdSymbol.fromDoubleValue).toBe('function');
    expect(typeof QvdSymbol.fromStringValue).toBe('function');
    expect(typeof QvdSymbol.fromDualIntValue).toBe('function');
    expect(typeof QvdSymbol.fromDualDoubleValue).toBe('function');
  });

  test('QvdSymbol instances should have all expected methods', () => {
    const symbol = QvdSymbol.fromIntValue(42);
    expect(typeof symbol.toPrimaryValue).toBe('function');
    expect(typeof symbol.toByteRepresentation).toBe('function');
    expect(typeof symbol.equals).toBe('function');
    expect(symbol.intValue).toBe(42);
    expect(symbol.doubleValue).toBeNull();
    expect(symbol.stringValue).toBeNull();
  });

  test('QvdDataFrame class should have all static methods', () => {
    expect(typeof QvdDataFrame.fromQvd).toBe('function');
    expect(typeof QvdDataFrame.fromDict).toBe('function');
  });

  test('QvdDataFrame instances should have all expected methods and properties', async () => {
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

    // Properties
    expect(df.data).toBeDefined();
    expect(df.columns).toBeDefined();
    expect(df.shape).toBeDefined();
    expect(df.metadata).toBeDefined();
    expect(df.fileMetadata).toBeDefined();

    // Methods
    expect(typeof df.head).toBe('function');
    expect(typeof df.tail).toBe('function');
    expect(typeof df.rows).toBe('function');
    expect(typeof df.at).toBe('function');
    expect(typeof df.select).toBe('function');
    expect(typeof df.toDict).toBe('function');
    expect(typeof df.toQvd).toBe('function');
    expect(typeof df.getFieldMetadata).toBe('function');
    expect(typeof df.getAllFieldMetadata).toBe('function');
    expect(typeof df.setFileMetadata).toBe('function');
    expect(typeof df.setFieldMetadata).toBe('function');
  });

  test('QvdFileReader class should be instantiable and have load method', () => {
    const reader = new QvdFileReader(path.join(__dirname, 'data/small.qvd'));
    expect(reader).toBeDefined();
    expect(typeof reader.load).toBe('function');
  });

  test('QvdFileWriter class should be instantiable and have save method', async () => {
    const df = await QvdDataFrame.fromDict({
      columns: ['A', 'B'],
      data: [
        [1, 2],
        [3, 4],
      ],
    });
    const writer = new QvdFileWriter('/tmp/test.qvd', df, {allowedDir: '/tmp'});
    expect(writer).toBeDefined();
    expect(typeof writer.save).toBe('function');
  });

  test('Complete workflow should work: read -> manipulate -> write', async () => {
    // Read
    const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));
    expect(df.shape[0]).toBe(606);

    // Manipulate
    const subset = df.head(10);
    expect(subset.shape[0]).toBe(10);

    const selected = subset.select('ProductKey', 'ProductName');
    expect(selected.columns.length).toBe(2);
    expect(selected.columns).toContain('ProductKey');
    expect(selected.columns).toContain('ProductName');

    // Convert to dict
    const dict = await selected.toDict();
    expect(dict.columns).toBeDefined();
    expect(dict.data).toBeDefined();
    expect(dict.data.length).toBe(10);
  });

  test('Symbol creation and comparison should work as before', () => {
    const symbol1 = QvdSymbol.fromIntValue(42);
    const symbol2 = QvdSymbol.fromIntValue(42);
    const symbol3 = QvdSymbol.fromIntValue(43);

    expect(symbol1.equals(symbol2)).toBe(true);
    expect(symbol1.equals(symbol3)).toBe(false);

    const dualSymbol = QvdSymbol.fromDualIntValue(10, 'ten');
    expect(dualSymbol.intValue).toBe(10);
    expect(dualSymbol.stringValue).toBe('ten');
    expect(dualSymbol.toPrimaryValue()).toBe('ten'); // String takes priority
  });
});
