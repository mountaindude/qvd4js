// @ts-check

/**
 * Base error class for all QVD-related errors.
 * Provides structured error information with error codes and context.
 */
export class QvdError extends Error {
  /**
   * Constructs a new QVD error.
   *
   * @param {string} message The error message.
   * @param {string} code The error code.
   * @param {Object} [context={}] Additional context about the error.
   */
  constructor(message, code, context = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when parsing a QVD file fails.
 * Used for issues during XML header parsing, symbol table parsing, or index table parsing.
 */
export class QvdParseError extends QvdError {
  /**
   * Constructs a new QVD parse error.
   *
   * @param {string} message The error message.
   * @param {Object} [context={}] Additional context about the error.
   */
  constructor(message, context = {}) {
    super(message, 'QVD_PARSE_ERROR', context);
  }
}

/**
 * Error thrown when input validation fails.
 * Used for invalid parameters, out of bounds access, or missing required data.
 */
export class QvdValidationError extends QvdError {
  /**
   * Constructs a new QVD validation error.
   *
   * @param {string} message The error message.
   * @param {Object} [context={}] Additional context about the error.
   */
  constructor(message, context = {}) {
    super(message, 'QVD_VALIDATION_ERROR', context);
  }
}

/**
 * Error thrown when file system operations fail.
 * Used for issues reading or writing QVD files.
 */
export class QvdIOError extends QvdError {
  /**
   * Constructs a new QVD IO error.
   *
   * @param {string} message The error message.
   * @param {Object} [context={}] Additional context about the error.
   */
  constructor(message, context = {}) {
    super(message, 'QVD_IO_ERROR', context);
  }
}

/**
 * Error thrown when a QVD file is corrupted or malformed.
 * Used for missing headers, invalid data structures, or corrupted data.
 */
export class QvdCorruptedError extends QvdError {
  /**
   * Constructs a new QVD corrupted error.
   *
   * @param {string} message The error message.
   * @param {Object} [context={}] Additional context about the error.
   */
  constructor(message, context = {}) {
    super(message, 'QVD_CORRUPTED_ERROR', context);
  }
}

/**
 * Error thrown when security violations occur.
 * Used for path traversal attempts, XXE attacks, or other security issues.
 */
export class QvdSecurityError extends QvdError {
  /**
   * Constructs a new QVD security error.
   *
   * @param {string} message The error message.
   * @param {Object} [context={}] Additional context about the error.
   */
  constructor(message, context = {}) {
    super(message, 'QVD_SECURITY_ERROR', context);
  }
}
