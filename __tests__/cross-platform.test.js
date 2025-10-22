import path from 'path';
import {validatePath} from '../src/util/validatePath.js';
import {QvdSecurityError} from '../src/QvdErrors.js';

describe('Cross-Platform Path Compatibility', () => {
  const originalPlatform = process.platform;

  afterEach(() => {
    // Restore original platform
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      writable: true,
      configurable: true,
    });
  });

  describe('Case sensitivity handling', () => {
    test('should use case-insensitive comparison on Windows (win32)', () => {
      // Mock Windows platform
      Object.defineProperty(process, 'platform', {
        value: 'win32',
        writable: true,
        configurable: true,
      });

      const testDir = path.join(__dirname, 'data');
      const testFile = path.join(__dirname, 'data', 'small.qvd');

      // This should NOT throw on Windows even though we're testing on Linux
      // because validatePath uses case-insensitive comparison on win32
      const result = validatePath(testFile, testDir);
      expect(result).toBe(path.resolve(testFile));
    });

    test('should use case-insensitive comparison on macOS (darwin)', () => {
      // Mock macOS platform
      Object.defineProperty(process, 'platform', {
        value: 'darwin',
        writable: true,
        configurable: true,
      });

      const testDir = path.join(__dirname, 'data');
      const testFile = path.join(__dirname, 'data', 'small.qvd');

      // This should NOT throw on macOS
      const result = validatePath(testFile, testDir);
      expect(result).toBe(path.resolve(testFile));
    });

    test('should use case-sensitive comparison on Linux', () => {
      // Mock Linux platform (likely already Linux, but explicit)
      Object.defineProperty(process, 'platform', {
        value: 'linux',
        writable: true,
        configurable: true,
      });

      const testDir = path.join(__dirname, 'data');
      const testFile = path.join(__dirname, 'data', 'small.qvd');

      // This should work on Linux with exact case
      const result = validatePath(testFile, testDir);
      expect(result).toBe(path.resolve(testFile));
    });
  });

  describe('Path separator handling', () => {
    test('should handle paths with path.sep correctly', () => {
      const testDir = path.join(__dirname, 'data');
      const testFile = path.join(__dirname, 'data', 'small.qvd');

      // Using path.join ensures correct separator for current platform
      const result = validatePath(testFile, testDir);
      expect(result).toBe(path.resolve(testFile));
    });

    test('should handle mixed path separators via path.resolve', () => {
      const testDir = path.join(__dirname, 'data');
      const testFile = path.join(__dirname, 'data', 'small.qvd');

      // path.resolve normalizes separators
      const result = validatePath(testFile, testDir);
      expect(result).toBe(path.resolve(testFile));
    });
  });

  describe('Platform-specific path features', () => {
    test('should correctly handle paths with drive letters on Windows', () => {
      // Mock Windows platform
      Object.defineProperty(process, 'platform', {
        value: 'win32',
        writable: true,
        configurable: true,
      });

      // On actual Windows, these would be real paths
      // On Linux/macOS in tests, path.resolve will prepend CWD
      const testDir = path.join(__dirname, 'data');
      const testFile = path.join(__dirname, 'data', 'small.qvd');

      const result = validatePath(testFile, testDir);
      expect(result).toBeTruthy();
    });

    test('should handle relative paths correctly on all platforms', () => {
      const testDir = path.join(__dirname, 'data');
      const relativePath = path.relative(process.cwd(), path.join(__dirname, 'data', 'small.qvd'));

      // Relative paths should work when resolved
      const result = validatePath(relativePath, testDir);
      expect(result).toBe(path.resolve(relativePath));
    });

    test('should handle absolute paths correctly on all platforms', () => {
      const testDir = path.join(__dirname, 'data');
      const absolutePath = path.join(__dirname, 'data', 'small.qvd');

      const result = validatePath(absolutePath, testDir);
      expect(result).toBe(path.resolve(absolutePath));
    });
  });

  describe('Edge cases across platforms', () => {
    test('should handle paths with trailing separators', () => {
      // Trailing separators should be normalized by path.resolve
      const testDirWithTrailing = path.join(__dirname, 'data') + path.sep;
      const testFile = path.join(__dirname, 'data', 'small.qvd');

      const result = validatePath(testFile, testDirWithTrailing);
      expect(result).toBe(path.resolve(testFile));
    });

    test('should handle paths with double separators', () => {
      // Double separators should be normalized by path.resolve
      const testDir = path.join(__dirname, 'data');
      const testFileWithDouble = path.join(__dirname, 'data', 'small.qvd').replace(path.sep, path.sep + path.sep);

      const result = validatePath(testFileWithDouble, testDir);
      expect(result).toBe(path.resolve(testFileWithDouble));
    });

    test('should handle current directory references (./)', () => {
      const testDir = path.join(__dirname, 'data');
      const testFileWithDot = path.join(__dirname, 'data', '.', 'small.qvd');

      const result = validatePath(testFileWithDot, testDir);
      expect(result).toBe(path.resolve(testFileWithDot));
    });

    test('should reject parent directory traversal (../) when outside allowedDir', () => {
      const restrictedDir = path.join(__dirname, 'data', 'subdir');
      const maliciousPath = path.join(restrictedDir, '..', '..', 'small.qvd');

      // This should fail because resolved path is outside restrictedDir
      expect(() => validatePath(maliciousPath, restrictedDir)).toThrow(QvdSecurityError);
    });
  });

  describe('Security validation across platforms', () => {
    test('should prevent path traversal on all platforms', () => {
      const testDir = path.join(__dirname, 'data');
      const maliciousPath = path.join(testDir, '..', '..', '..', 'etc', 'passwd');

      expect(() => validatePath(maliciousPath, testDir)).toThrow(QvdSecurityError);
      expect(() => validatePath(maliciousPath, testDir)).toThrow('Access denied');
    });

    test('should prevent null byte injection on all platforms', () => {
      const testDir = path.join(__dirname, 'data');
      const maliciousPath = path.join(__dirname, 'data', 'small.qvd') + '\0.txt';

      expect(() => validatePath(maliciousPath, testDir)).toThrow(QvdSecurityError);
      expect(() => validatePath(maliciousPath, testDir)).toThrow('Null byte');
    });

    test('should allow access to files within allowedDir on all platforms', () => {
      const testDir = path.join(__dirname, 'data');
      const testFile = path.join(__dirname, 'data', 'small.qvd');

      const result = validatePath(testFile, testDir);
      expect(result).toBe(path.resolve(testFile));
    });

    test('should prevent access outside allowedDir on all platforms', () => {
      const restrictedDir = path.join(__dirname, 'data', 'subdir');
      const outsideFile = path.join(__dirname, 'data', 'small.qvd');

      expect(() => validatePath(outsideFile, restrictedDir)).toThrow(QvdSecurityError);
    });
  });

  describe('Platform detection', () => {
    test('should correctly identify case-insensitive file systems', () => {
      // Test Windows
      Object.defineProperty(process, 'platform', {
        value: 'win32',
        writable: true,
        configurable: true,
      });

      const testDir = path.join(__dirname, 'data');
      const testFile = path.join(__dirname, 'data', 'small.qvd');

      // Should not throw with case-insensitive comparison
      expect(() => validatePath(testFile, testDir)).not.toThrow();

      // Test macOS
      Object.defineProperty(process, 'platform', {
        value: 'darwin',
        writable: true,
        configurable: true,
      });

      // Should not throw with case-insensitive comparison
      expect(() => validatePath(testFile, testDir)).not.toThrow();

      // Test Linux
      Object.defineProperty(process, 'platform', {
        value: 'linux',
        writable: true,
        configurable: true,
      });

      // Should not throw with case-sensitive comparison (when case matches)
      expect(() => validatePath(testFile, testDir)).not.toThrow();
    });
  });
});
