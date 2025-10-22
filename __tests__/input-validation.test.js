import path from 'path';
import {QvdDataFrame, QvdValidationError} from '../src';
import {getDirname} from './test-utils.js';

const __dirname = getDirname(import.meta.url);

describe('QvdDataFrame Input Validation', () => {
  let df;

  beforeAll(async () => {
    df = await QvdDataFrame.fromQvd(path.join(__dirname, 'data/small.qvd'));
  });

  describe('head(n) validation', () => {
    test('should throw error for negative values', () => {
      expect(() => df.head(-5)).toThrow(QvdValidationError);
      expect(() => df.head(-5)).toThrow('head() requires a non-negative integer');
    });

    test('should throw error for non-numeric values', () => {
      expect(() => df.head('abc')).toThrow(QvdValidationError);
      expect(() => df.head('abc')).toThrow('head() requires a non-negative integer');
    });

    test('should throw error for NaN', () => {
      expect(() => df.head(NaN)).toThrow(QvdValidationError);
      expect(() => df.head(NaN)).toThrow('head() requires a non-negative integer');
    });

    test('should throw error for Infinity', () => {
      expect(() => df.head(Infinity)).toThrow(QvdValidationError);
      expect(() => df.head(Infinity)).toThrow('head() requires a non-negative integer');
    });

    test('should throw error for floating point numbers', () => {
      expect(() => df.head(5.5)).toThrow(QvdValidationError);
      expect(() => df.head(5.5)).toThrow('head() requires a non-negative integer');
    });

    test('should work with valid positive integers', () => {
      expect(df.head(5).shape[0]).toBe(5);
      expect(df.head(0).shape[0]).toBe(0);
      expect(df.head(1).shape[0]).toBe(1);
    });

    test('should work with default parameter', () => {
      expect(df.head().shape[0]).toBe(5);
    });
  });

  describe('tail(n) validation', () => {
    test('should throw error for negative values', () => {
      expect(() => df.tail(-5)).toThrow(QvdValidationError);
      expect(() => df.tail(-5)).toThrow('tail() requires a non-negative integer');
    });

    test('should throw error for non-numeric values', () => {
      expect(() => df.tail('abc')).toThrow(QvdValidationError);
      expect(() => df.tail('abc')).toThrow('tail() requires a non-negative integer');
    });

    test('should throw error for NaN', () => {
      expect(() => df.tail(NaN)).toThrow(QvdValidationError);
      expect(() => df.tail(NaN)).toThrow('tail() requires a non-negative integer');
    });

    test('should throw error for Infinity', () => {
      expect(() => df.tail(Infinity)).toThrow(QvdValidationError);
      expect(() => df.tail(Infinity)).toThrow('tail() requires a non-negative integer');
    });

    test('should throw error for floating point numbers', () => {
      expect(() => df.tail(5.5)).toThrow(QvdValidationError);
      expect(() => df.tail(5.5)).toThrow('tail() requires a non-negative integer');
    });

    test('should work with valid positive integers', () => {
      expect(df.tail(5).shape[0]).toBe(5);
      expect(df.tail(0).shape[0]).toBe(0);
      expect(df.tail(1).shape[0]).toBe(1);
    });

    test('should work with default parameter', () => {
      expect(df.tail().shape[0]).toBe(5);
    });
  });

  describe('rows(...args) validation', () => {
    test('should throw error for out of bounds indices', () => {
      expect(() => df.rows(999999)).toThrow(QvdValidationError);
      expect(() => df.rows(999999)).toThrow('Row index 999999 out of bounds');
    });

    test('should throw error for negative indices', () => {
      expect(() => df.rows(-1)).toThrow(QvdValidationError);
      expect(() => df.rows(-1)).toThrow('Row index -1 out of bounds');
    });

    test('should throw error for floating point indices', () => {
      expect(() => df.rows(1.5)).toThrow(QvdValidationError);
      expect(() => df.rows(1.5)).toThrow('rows() requires integer indices');
    });

    test('should throw error for non-numeric indices', () => {
      expect(() => df.rows('abc')).toThrow(QvdValidationError);
      expect(() => df.rows('abc')).toThrow('rows() requires integer indices');
    });

    test('should throw error for NaN indices', () => {
      expect(() => df.rows(NaN)).toThrow(QvdValidationError);
      expect(() => df.rows(NaN)).toThrow('rows() requires integer indices');
    });

    test('should throw error if any index is invalid in multiple arguments', () => {
      expect(() => df.rows(0, 999999)).toThrow(QvdValidationError);
      expect(() => df.rows(0, 999999)).toThrow('Row index 999999 out of bounds');
    });

    test('should work with valid indices', () => {
      const result = df.rows(0, 1, 2);
      expect(result.shape[0]).toBe(3);
    });

    test('should work with single valid index', () => {
      const result = df.rows(0);
      expect(result.shape[0]).toBe(1);
    });

    test('should include error context with valid range', () => {
      try {
        df.rows(999999);
      } catch (error) {
        expect(error.context.validRange).toEqual([0, df.shape[0] - 1]);
        expect(error.context.dataLength).toBe(df.shape[0]);
      }
    });
  });

  describe('at(row, column) validation', () => {
    test('should throw error for out of bounds row index', () => {
      expect(() => df.at(999999, df.columns[0])).toThrow(QvdValidationError);
      expect(() => df.at(999999, df.columns[0])).toThrow('Row index 999999 out of bounds');
    });

    test('should throw error for negative row index', () => {
      expect(() => df.at(-1, df.columns[0])).toThrow(QvdValidationError);
      expect(() => df.at(-1, df.columns[0])).toThrow('Row index -1 out of bounds');
    });

    test('should throw error for non-integer row index', () => {
      expect(() => df.at(1.5, df.columns[0])).toThrow(QvdValidationError);
      expect(() => df.at(1.5, df.columns[0])).toThrow('Row index must be an integer');
    });

    test('should throw error for non-numeric row index', () => {
      expect(() => df.at('abc', df.columns[0])).toThrow(QvdValidationError);
      expect(() => df.at('abc', df.columns[0])).toThrow('Row index must be an integer');
    });

    test('should throw error for nonexistent column', () => {
      expect(() => df.at(0, 'nonexistent')).toThrow(QvdValidationError);
      expect(() => df.at(0, 'nonexistent')).toThrow("Column 'nonexistent' does not exist");
    });

    test('should work with valid row and column', () => {
      const value = df.at(0, df.columns[0]);
      expect(value).toBeDefined();
    });

    test('should include error context with available columns', () => {
      try {
        df.at(0, 'nonexistent');
      } catch (error) {
        expect(error.context.column).toBe('nonexistent');
        expect(error.context.availableColumns).toEqual(df.columns);
      }
    });

    test('should include error context with valid range for row', () => {
      try {
        df.at(999999, df.columns[0]);
      } catch (error) {
        expect(error.context.validRange).toEqual([0, df.shape[0] - 1]);
        expect(error.context.dataLength).toBe(df.shape[0]);
      }
    });
  });

  describe('select(...args) validation', () => {
    test('should throw error for nonexistent column', () => {
      expect(() => df.select('nonexistent')).toThrow(QvdValidationError);
      expect(() => df.select('nonexistent')).toThrow("Column 'nonexistent' does not exist");
    });

    test('should throw error if any column is invalid in multiple arguments', () => {
      expect(() => df.select(df.columns[0], 'nonexistent')).toThrow(QvdValidationError);
      expect(() => df.select(df.columns[0], 'nonexistent')).toThrow("Column 'nonexistent' does not exist");
    });

    test('should work with valid columns', () => {
      const result = df.select(df.columns[0], df.columns[1]);
      expect(result.columns.length).toBe(2);
      expect(result.columns).toEqual([df.columns[0], df.columns[1]]);
    });

    test('should work with single valid column', () => {
      const result = df.select(df.columns[0]);
      expect(result.columns.length).toBe(1);
      expect(result.columns[0]).toBe(df.columns[0]);
    });

    test('should include error context with available columns', () => {
      try {
        df.select('nonexistent');
      } catch (error) {
        expect(error.context.column).toBe('nonexistent');
        expect(error.context.availableColumns).toEqual(df.columns);
      }
    });
  });

  describe('Error class validation', () => {
    test('all validation errors should be instances of QvdValidationError', () => {
      expect(() => df.head(-1)).toThrow(QvdValidationError);
      expect(() => df.tail(-1)).toThrow(QvdValidationError);
      expect(() => df.rows(999999)).toThrow(QvdValidationError);
      expect(() => df.at(999999, df.columns[0])).toThrow(QvdValidationError);
      expect(() => df.select('nonexistent')).toThrow(QvdValidationError);
    });

    test('validation errors should have correct error code', () => {
      try {
        df.head(-1);
      } catch (error) {
        expect(error.code).toBe('QVD_VALIDATION_ERROR');
      }
    });

    test('validation errors should have context', () => {
      try {
        df.head(-1);
      } catch (error) {
        expect(error.context).toBeDefined();
        expect(error.context.provided).toBe(-1);
      }
    });
  });
});
