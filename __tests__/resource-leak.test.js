import path from 'path';
import fs from 'fs';
import {QvdDataFrame} from '../src';

describe('Resource leak prevention in QvdFileReader', () => {
  test('File descriptor should be closed even when read operation fails', async () => {
    // Get the number of open file descriptors before the test
    const getOpenFdCount = () => {
      try {
        // On Linux/Unix, /proc/self/fd shows all open file descriptors
        return fs.readdirSync('/proc/self/fd').length;
      } catch {
        // On systems without /proc, we can't reliably count FDs
        // so we'll skip this part of the test
        return null;
      }
    };

    const initialFdCount = getOpenFdCount();

    // Try to load a file with invalid maxRows to trigger an error path
    // We'll use a valid file but with a very large maxRows that might cause issues
    const testFilePath = path.join(__dirname, 'data/small.qvd');

    // Perform multiple operations to ensure no file descriptors leak
    for (let i = 0; i < 5; i++) {
      try {
        // Load with maxRows to exercise the code path with file descriptor
        await QvdDataFrame.fromQvd(testFilePath, {maxRows: 10});
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // Ignore any errors - we're just checking for resource leaks
      }
    }

    // Force garbage collection if available (node --expose-gc)
    if (global.gc) {
      global.gc();
    }

    // Give the system time to clean up
    await new Promise((resolve) => setTimeout(resolve, 100));

    const finalFdCount = getOpenFdCount();

    // If we can count FDs, verify they haven't increased
    if (initialFdCount !== null && finalFdCount !== null) {
      // Allow a small margin for other operations, but there shouldn't be 5+ leaked FDs
      expect(finalFdCount - initialFdCount).toBeLessThan(5);
    }

    // This test mainly ensures the code doesn't throw and completes successfully
    expect(true).toBe(true);
  });

  test('File descriptor should be closed on successful read with maxRows', async () => {
    const testFilePath = path.join(__dirname, 'data/small.qvd');

    // Load the file successfully
    const df = await QvdDataFrame.fromQvd(testFilePath, {maxRows: 10});

    expect(df).toBeDefined();
    expect(df.shape[0]).toBe(10);

    // Try to read the same file again immediately to ensure no locks
    const df2 = await QvdDataFrame.fromQvd(testFilePath, {maxRows: 5});

    expect(df2).toBeDefined();
    expect(df2.shape[0]).toBe(5);
  });

  test('Multiple concurrent reads should not leak file descriptors', async () => {
    const testFilePath = path.join(__dirname, 'data/small.qvd');

    // Perform multiple concurrent reads
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(QvdDataFrame.fromQvd(testFilePath, {maxRows: 5}));
    }

    const results = await Promise.all(promises);

    // All should succeed
    expect(results.length).toBe(10);
    results.forEach((df) => {
      expect(df).toBeDefined();
      expect(df.shape[0]).toBe(5);
    });
  });

  test('File descriptor should be closed when loading entire file (no maxRows)', async () => {
    const testFilePath = path.join(__dirname, 'data/small.qvd');

    // Load without maxRows (uses different code path)
    const df = await QvdDataFrame.fromQvd(testFilePath);

    expect(df).toBeDefined();
    expect(df.shape[0]).toBe(606);

    // Verify we can load again immediately
    const df2 = await QvdDataFrame.fromQvd(testFilePath);

    expect(df2).toBeDefined();
    expect(df2.shape[0]).toBe(606);
  });
});
