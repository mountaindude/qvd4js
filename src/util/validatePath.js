// @ts-check

import path from 'path';
import {QvdSecurityError} from '../QvdErrors.js';

/**
 * Validates that a file path does not contain path traversal sequences.
 *
 * @param {string} filePath The path to validate.
 * @param {string} [allowedDir] Optional allowed directory path. If not provided, defaults to the
 *   current working directory to prevent path traversal attacks.
 * @throws {QvdSecurityError} If path traversal is detected.
 * @return {string} The resolved absolute path.
 */
export function validatePath(filePath, allowedDir) {
  // Check for null bytes which can be used in path traversal attacks
  if (filePath.includes('\0')) {
    throw new QvdSecurityError('Path traversal detected: Null byte in path', {
      path: filePath,
      reason: 'null_byte',
    });
  }

  // Default to current working directory if no allowed directory is specified
  // This prevents path traversal attacks by ensuring files can only be accessed
  // within the CWD or a more restrictive allowed directory
  const baseDir = allowedDir || process.cwd();
  const resolvedBaseDir = path.resolve(baseDir);
  const resolvedPath = path.resolve(filePath);

  // Ensure the resolved path is within the allowed directory
  // Use path.sep to ensure proper directory boundary checking across platforms
  // On Windows and macOS (default APFS), file systems are case-insensitive,
  // so we need case-insensitive comparison. On Linux, use case-sensitive comparison.
  const isCaseInsensitiveFS = process.platform === 'win32' || process.platform === 'darwin';
  const baseForComparison = isCaseInsensitiveFS ? resolvedBaseDir.toLowerCase() : resolvedBaseDir;
  const pathForComparison = isCaseInsensitiveFS ? resolvedPath.toLowerCase() : resolvedPath;

  if (!pathForComparison.startsWith(baseForComparison + path.sep) && pathForComparison !== baseForComparison) {
    throw new QvdSecurityError('Path traversal detected: Access denied', {
      path: filePath,
      resolvedPath,
      allowedDir: resolvedBaseDir,
      reason: 'outside_allowed_directory',
    });
  }

  return resolvedPath;
}
