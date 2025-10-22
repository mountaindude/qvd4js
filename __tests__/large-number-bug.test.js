import fs from 'fs';
import {QvdDataFrame} from '../src';

test('Should handle very large numbers when writing QVD files', async () => {
  const rawDf = {
    columns: ['Key', 'LargeNumber'],
    data: [
      [1, 8.45e86], // Very large number that caused the bug
      [2, 1.23e50],
      [3, 5.67e-30], // Very small number
      [4, 2147483647], // Max int32
      [5, 2147483648], // Just above max int32
    ],
  };

  const df = await QvdDataFrame.fromDict(rawDf);

  expect(df).toBeDefined();
  expect(df.shape).toEqual([5, 2]);

  // This should not throw a RangeError
  await df.toQvd('__tests__/data/large-numbers.qvd');

  expect(fs.existsSync('__tests__/data/large-numbers.qvd')).toBe(true);

  // Verify we can read it back
  const dfRead = await QvdDataFrame.fromQvd('__tests__/data/large-numbers.qvd');
  expect(dfRead.shape).toEqual([5, 2]);

  // Clean up
  fs.unlinkSync('__tests__/data/large-numbers.qvd');
});

test('Should handle numbers at int32 boundary correctly', async () => {
  const INT32_MIN = -2147483648;
  const INT32_MAX = 2147483647;

  const rawDf = {
    columns: ['Value'],
    data: [
      [INT32_MIN], // Minimum int32
      [INT32_MAX], // Maximum int32
      [INT32_MIN - 1], // Below minimum (should be treated as double)
      [INT32_MAX + 1], // Above maximum (should be treated as double)
      [0],
      [-1],
      [1],
    ],
  };

  const df = await QvdDataFrame.fromDict(rawDf);

  // This should not throw a RangeError
  await df.toQvd('__tests__/data/int32-boundary.qvd');

  expect(fs.existsSync('__tests__/data/int32-boundary.qvd')).toBe(true);

  // Verify we can read it back
  const dfRead = await QvdDataFrame.fromQvd('__tests__/data/int32-boundary.qvd');
  expect(dfRead.shape).toEqual([7, 1]);

  // Clean up
  fs.unlinkSync('__tests__/data/int32-boundary.qvd');
});
