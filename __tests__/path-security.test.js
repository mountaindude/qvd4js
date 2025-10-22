import path from 'path';
import fs from 'fs';
import {QvdDataFrame, QvdSecurityError} from '../src';

describe('Path Traversal Security', () => {
  let testDataPath;
  let testDir;

  beforeAll(() => {
    testDataPath = path.join(__dirname, 'data/small.qvd');
    testDir = path.join(__dirname, 'data');
  });

  describe('QvdFileReader path validation', () => {
    test('should successfully read file with absolute path', async () => {
      const df = await QvdDataFrame.fromQvd(testDataPath);
      expect(df).toBeDefined();
      expect(df.shape[0]).toBeGreaterThan(0);
    });

    test('should successfully read file with relative path', async () => {
      const relativePath = path.relative(process.cwd(), testDataPath);
      const df = await QvdDataFrame.fromQvd(relativePath);
      expect(df).toBeDefined();
      expect(df.shape[0]).toBeGreaterThan(0);
    });

    test('should prevent null byte injection', async () => {
      const maliciousPath = testDataPath + '\0.txt';
      await expect(QvdDataFrame.fromQvd(maliciousPath)).rejects.toThrow(QvdSecurityError);
      await expect(QvdDataFrame.fromQvd(maliciousPath)).rejects.toThrow('Null byte');
    });

    test('should allow file access when within allowed directory', async () => {
      const df = await QvdDataFrame.fromQvd(testDataPath, {allowedDir: testDir});
      expect(df).toBeDefined();
      expect(df.shape[0]).toBeGreaterThan(0);
    });

    test('should prevent access outside allowed directory with absolute path', async () => {
      const restrictedDir = path.join(__dirname, 'data', 'subdir');
      await expect(QvdDataFrame.fromQvd(testDataPath, {allowedDir: restrictedDir})).rejects.toThrow(QvdSecurityError);
      await expect(QvdDataFrame.fromQvd(testDataPath, {allowedDir: restrictedDir})).rejects.toThrow('Access denied');
    });

    test('should prevent path traversal with ../ sequences when allowedDir is set', async () => {
      const maliciousPath = path.join(testDir, '../../../etc/passwd');
      await expect(QvdDataFrame.fromQvd(maliciousPath, {allowedDir: testDir})).rejects.toThrow(QvdSecurityError);
    });

    test('should normalize paths correctly', async () => {
      const pathWithDots = path.join(testDir, './small.qvd');
      const df = await QvdDataFrame.fromQvd(pathWithDots, {allowedDir: testDir});
      expect(df).toBeDefined();
      expect(df.shape[0]).toBeGreaterThan(0);
    });

    test('should include security context in error', async () => {
      await expect(async () => {
        await QvdDataFrame.fromQvd(testDataPath, {allowedDir: '/restricted/path'});
      }).rejects.toMatchObject({
        name: 'QvdSecurityError',
        context: expect.objectContaining({
          reason: 'outside_allowed_directory',
          allowedDir: expect.anything(),
          resolvedPath: expect.anything(),
        }),
      });
    });

    test('should have correct error code', async () => {
      await expect(async () => {
        await QvdDataFrame.fromQvd(testDataPath + '\0', {allowedDir: testDir});
      }).rejects.toMatchObject({
        code: 'QVD_SECURITY_ERROR',
      });
    });
  });

  describe('QvdFileWriter path validation', () => {
    let df;
    let tempDir;

    beforeAll(async () => {
      df = await QvdDataFrame.fromQvd(testDataPath);
      tempDir = path.join(__dirname, '../tmp-test-security');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, {recursive: true});
      }
    });

    afterAll(() => {
      // Clean up temp directory
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, {recursive: true, force: true});
      }
    });

    test('should successfully write file with absolute path', async () => {
      const outputPath = path.join(tempDir, 'output-absolute.qvd');
      await df.toQvd(outputPath);
      expect(fs.existsSync(outputPath)).toBe(true);
    });

    test('should successfully write file with relative path', async () => {
      const outputPath = path.join(tempDir, 'output-relative.qvd');
      const relativePath = path.relative(process.cwd(), outputPath);
      await df.toQvd(relativePath);
      expect(fs.existsSync(outputPath)).toBe(true);
    });

    test('should prevent null byte injection', async () => {
      const maliciousPath = path.join(tempDir, 'output.qvd\0.txt');
      await expect(df.toQvd(maliciousPath)).rejects.toThrow(QvdSecurityError);
      await expect(df.toQvd(maliciousPath)).rejects.toThrow('Null byte');
    });

    test('should allow file write when within allowed directory', async () => {
      const outputPath = path.join(tempDir, 'output-allowed.qvd');
      await df.toQvd(outputPath, {allowedDir: tempDir});
      expect(fs.existsSync(outputPath)).toBe(true);
    });

    test('should prevent write outside allowed directory', async () => {
      const outputPath = path.join(tempDir, 'output-restricted.qvd');
      const restrictedDir = path.join(tempDir, 'subdir');
      await expect(df.toQvd(outputPath, {allowedDir: restrictedDir})).rejects.toThrow(QvdSecurityError);
      await expect(df.toQvd(outputPath, {allowedDir: restrictedDir})).rejects.toThrow('Access denied');
    });

    test('should prevent path traversal with ../ sequences when allowedDir is set', async () => {
      const maliciousPath = path.join(tempDir, '../../../tmp/malicious.qvd');
      await expect(df.toQvd(maliciousPath, {allowedDir: tempDir})).rejects.toThrow(QvdSecurityError);
    });

    test('should normalize paths correctly for writes', async () => {
      const pathWithDots = path.join(tempDir, './output-normalized.qvd');
      await df.toQvd(pathWithDots, {allowedDir: tempDir});
      expect(fs.existsSync(path.join(tempDir, 'output-normalized.qvd'))).toBe(true);
    });

    test('should include security context in write error', async () => {
      await expect(async () => {
        await df.toQvd('/etc/passwd', {allowedDir: tempDir});
      }).rejects.toMatchObject({
        name: 'QvdSecurityError',
        context: expect.objectContaining({
          reason: 'outside_allowed_directory',
          allowedDir: expect.anything(),
          resolvedPath: expect.anything(),
        }),
      });
    });

    test('should have correct error code for write', async () => {
      await expect(async () => {
        await df.toQvd(path.join(tempDir, 'output.qvd\0'));
      }).rejects.toMatchObject({
        code: 'QVD_SECURITY_ERROR',
      });
    });
  });

  describe('Path validation edge cases', () => {
    test('should handle empty path strings', async () => {
      await expect(QvdDataFrame.fromQvd('')).rejects.toThrow();
    });

    test('should handle paths with multiple slashes', async () => {
      const pathWithMultipleSlashes = testDataPath.replace(path.sep, path.sep + path.sep);
      const df = await QvdDataFrame.fromQvd(pathWithMultipleSlashes);
      expect(df).toBeDefined();
    });

    test('should allow file exactly at allowed directory boundary', async () => {
      const df = await QvdDataFrame.fromQvd(testDataPath, {allowedDir: testDataPath});
      expect(df).toBeDefined();
    });
  });

  describe('Security error properties', () => {
    test('QvdSecurityError should extend Error', () => {
      const error = new QvdSecurityError('Test message');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(QvdSecurityError);
    });

    test('QvdSecurityError should have correct properties', () => {
      const context = {path: '/test/path', reason: 'test_reason'};
      const error = new QvdSecurityError('Test message', context);
      expect(error.message).toBe('Test message');
      expect(error.code).toBe('QVD_SECURITY_ERROR');
      expect(error.context).toEqual(context);
      expect(error.name).toBe('QvdSecurityError');
    });
  });
});
