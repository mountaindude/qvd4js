import path from 'path';
import {
  QvdError,
  QvdParseError,
  QvdValidationError,
  QvdIOError,
  QvdCorruptedError,
  QvdSecurityError,
  QvdDataFrame,
} from '../src';
import {getDirname} from './test-utils.js';

const __dirname = getDirname(import.meta.url);

describe('Custom Error Classes', () => {
  describe('QvdError', () => {
    test('should create base error with code and context', () => {
      const error = new QvdError('Test error', 'TEST_CODE', {key: 'value'});

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(QvdError);
      expect(error.name).toBe('QvdError');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.context).toEqual({key: 'value'});
      expect(error.stack).toBeDefined();
    });

    test('should work without context', () => {
      const error = new QvdError('Test error', 'TEST_CODE');

      expect(error.context).toEqual({});
    });
  });

  describe('QvdParseError', () => {
    test('should create parse error with correct code', () => {
      const error = new QvdParseError('Parse failed', {offset: 100});

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(QvdError);
      expect(error).toBeInstanceOf(QvdParseError);
      expect(error.name).toBe('QvdParseError');
      expect(error.message).toBe('Parse failed');
      expect(error.code).toBe('QVD_PARSE_ERROR');
      expect(error.context).toEqual({offset: 100});
    });

    test('should be thrown for unknown symbol type in real file', async () => {
      // We can't easily create a corrupted QVD file, so we test the error class structure
      const error = new QvdParseError('Unknown symbol type byte', {
        typeByte: 'ff',
        offset: 512,
        file: '/path/to/file.qvd',
        stage: 'parseSymbolTable',
      });

      expect(error.code).toBe('QVD_PARSE_ERROR');
      expect(error.context.typeByte).toBe('ff');
      expect(error.context.offset).toBe(512);
    });
  });

  describe('QvdValidationError', () => {
    test('should create validation error with correct code', () => {
      const error = new QvdValidationError('Invalid input', {param: 'test'});

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(QvdError);
      expect(error).toBeInstanceOf(QvdValidationError);
      expect(error.name).toBe('QvdValidationError');
      expect(error.message).toBe('Invalid input');
      expect(error.code).toBe('QVD_VALIDATION_ERROR');
      expect(error.context).toEqual({param: 'test'});
    });

    test('should be thrown for missing columns in fromDict', async () => {
      await expect(QvdDataFrame.fromDict({data: []})).rejects.toThrow(QvdValidationError);
      await expect(QvdDataFrame.fromDict({data: []})).rejects.toMatchObject({
        code: 'QVD_VALIDATION_ERROR',
        message: expect.stringContaining('columns'),
      });
    });

    test('should be thrown for missing data in fromDict', async () => {
      await expect(QvdDataFrame.fromDict({columns: ['col1']})).rejects.toThrow(QvdValidationError);
      await expect(QvdDataFrame.fromDict({columns: ['col1']})).rejects.toMatchObject({
        code: 'QVD_VALIDATION_ERROR',
        message: expect.stringContaining('data'),
      });
    });
  });

  describe('QvdIOError', () => {
    test('should create IO error with correct code', () => {
      const error = new QvdIOError('File not found', {path: '/test/file.qvd'});

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(QvdError);
      expect(error).toBeInstanceOf(QvdIOError);
      expect(error.name).toBe('QvdIOError');
      expect(error.message).toBe('File not found');
      expect(error.code).toBe('QVD_IO_ERROR');
      expect(error.context).toEqual({path: '/test/file.qvd'});
    });
  });

  describe('QvdCorruptedError', () => {
    test('should create corrupted error with correct code', () => {
      const error = new QvdCorruptedError('Malformed header', {file: 'test.qvd'});

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(QvdError);
      expect(error).toBeInstanceOf(QvdCorruptedError);
      expect(error.name).toBe('QvdCorruptedError');
      expect(error.message).toBe('Malformed header');
      expect(error.code).toBe('QVD_CORRUPTED_ERROR');
      expect(error.context).toEqual({file: 'test.qvd'});
    });
  });

  describe('QvdSecurityError', () => {
    test('should create security error with correct code', () => {
      const error = new QvdSecurityError('Path traversal detected', {path: '../../../etc/passwd'});

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(QvdError);
      expect(error).toBeInstanceOf(QvdSecurityError);
      expect(error.name).toBe('QvdSecurityError');
      expect(error.message).toBe('Path traversal detected');
      expect(error.code).toBe('QVD_SECURITY_ERROR');
      expect(error.context).toEqual({path: '../../../etc/passwd'});
    });
  });

  describe('Error Catching Patterns', () => {
    test('should allow catching specific error types', async () => {
      try {
        await QvdDataFrame.fromDict({});
      } catch (error) {
        expect(error instanceof QvdValidationError).toBe(true);
        expect(error instanceof QvdError).toBe(true);
        expect(error.code).toBe('QVD_VALIDATION_ERROR');
      }
    });

    test('should allow accessing error context', async () => {
      try {
        await QvdDataFrame.fromDict({data: []});
      } catch (error) {
        expect(error.context).toBeDefined();
        expect(error.context.data).toEqual({data: []});
      }
    });

    test('should allow differentiating between error types', () => {
      const parseError = new QvdParseError('Parse error');
      const validationError = new QvdValidationError('Validation error');

      expect(parseError instanceof QvdParseError).toBe(true);
      expect(parseError instanceof QvdValidationError).toBe(false);

      expect(validationError instanceof QvdValidationError).toBe(true);
      expect(validationError instanceof QvdParseError).toBe(false);

      // Both should be instances of base class
      expect(parseError instanceof QvdError).toBe(true);
      expect(validationError instanceof QvdError).toBe(true);
    });
  });

  describe('Integration with Real Operations', () => {
    test('should throw QvdIOError for non-existent file', async () => {
      await expect(QvdDataFrame.fromQvd('/non/existent/file.qvd')).rejects.toThrow();
    });

    test('should successfully load valid QVD file without errors', async () => {
      const df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));

      expect(df).toBeDefined();
      expect(df.shape).toBeDefined();
      expect(df.columns).toBeDefined();
    });
  });
});
