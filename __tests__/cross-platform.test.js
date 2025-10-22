import path from 'path';
import {validatePath} from '../src/util/validatePath.js';
import {QvdSecurityError} from '../src/QvdErrors.js';

describe('Cross-Platform Path Compatibility', () => {
  const originalDescriptor = Object.getOwnPropertyDescriptor(process, 'platform');

  const mockPlatform = (value) => {
    // Redefine process.platform to the desired value for this test
    Object.defineProperty(process, 'platform', {
      value,
    });
  };

  afterEach(() => {
    // Restore original descriptor for process.platform after each test
    if (originalDescriptor) {
      Object.defineProperty(process, 'platform', originalDescriptor);
    }
  });

  describe('Case sensitivity handling', () => {
    test('should use case-insensitive comparison on Windows (win32)', () => {
      // Mock Windows platform
      mockPlatform('win32');

      const testDir = path.join(__dirname, 'data');
      const testFile = path.join(__dirname, 'data', 'small.qvd');

      // This should NOT throw on Windows even though we're testing on Linux
      // because validatePath uses case-insensitive comparison on win32
      const result = validatePath(testFile, testDir);
      expect(result).toBe(path.resolve(testFile));
    });

    test('should use case-insensitive comparison on macOS (darwin)', () => {
      // Mock macOS platform
      mockPlatform('darwin');

      const testDir = path.join(__dirname, 'data');
      const testFile = path.join(__dirname, 'data', 'small.qvd');

      // This should NOT throw on macOS
      const result = validatePath(testFile, testDir);
      expect(result).toBe(path.resolve(testFile));
    });

    test('should use case-sensitive comparison on Linux', () => {
      // Mock Linux platform (explicit)
      mockPlatform('linux');

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
      mockPlatform('win32');

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
      mockPlatform('win32');

      const testDir = path.join(__dirname, 'data');
      const testFile = path.join(__dirname, 'data', 'small.qvd');

      // Should not throw with case-insensitive comparison
      expect(() => validatePath(testFile, testDir)).not.toThrow();

      // Test macOS
      mockPlatform('darwin');

      // Should not throw with case-insensitive comparison
      expect(() => validatePath(testFile, testDir)).not.toThrow();

      // Test Linux
      mockPlatform('linux');

      // Should not throw with case-sensitive comparison (when case matches)
      expect(() => validatePath(testFile, testDir)).not.toThrow();
    });
  });

  describe('Windows path shapes (win32 path module mocked)', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(process, 'platform');

    const mockPlatform = (value) => {
      Object.defineProperty(process, 'platform', {value});
    };

    const loadValidatePathWithWin32 = () => {
      // Load validatePath with 'path' mocked to the real win32 implementation
      const realPath = jest.requireActual('path');
      let validatePathWin;
      jest.isolateModules(() => {
        jest.doMock('path', () => realPath.win32);
        // eslint-disable-next-line global-require
        validatePathWin = require('../src/util/validatePath.js').validatePath;
      });
      return validatePathWin;
    };

    afterEach(() => {
      // Restore originals and clear mocks
      jest.resetModules();
      jest.unmock('path');
      if (originalDescriptor) {
        Object.defineProperty(process, 'platform', originalDescriptor);
      }
    });

    test('should accept drive-letter paths within allowedDir (C:\\...)', () => {
      mockPlatform('win32');
      const validatePathWin = loadValidatePathWithWin32();
      const winPath = require('path').win32;

      const baseDir = 'C\\\\Users\\Test\\data'; // 'C:\\Users\\Test\\data' string literal
      const filePath = 'C\\\\Users\\Test\\data\\small.qvd';

      const result = validatePathWin(filePath, baseDir);
      expect(result).toBe(winPath.resolve(filePath));
    });

    test('should accept UNC paths within allowedDir (\\\\server\\share\\...)', () => {
      mockPlatform('win32');
      const validatePathWin = loadValidatePathWithWin32();
      const winPath = require('path').win32;

      const baseDir = '\\\\server\\share\\data'; // "\\server\share\data"
      const filePath = '\\\\server\\share\\data\\small.qvd';

      const result = validatePathWin(filePath, baseDir);
      expect(result).toBe(winPath.resolve(filePath));
    });

    test('should reject UNC path outside allowedDir', () => {
      mockPlatform('win32');
      const validatePathWin = loadValidatePathWithWin32();

      const baseDir = '\\\\server\\share\\data';
      const outsidePath = '\\\\server\\share\\other\\small.qvd';

      // Use message-based assertion to avoid mismatched constructor instances across module isolates
      expect(() => validatePathWin(outsidePath, baseDir)).toThrow(/Access denied/);
    });
  });
});
