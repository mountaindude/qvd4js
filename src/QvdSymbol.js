// @ts-check

import {QvdValidationError} from './QvdErrors.js';

/**
 * Represents a Qlik symbol/value, stored in a QVD file.
 */
export class QvdSymbol {
  /**
   * Constructs a new QVD symbol.
   *
   * @param {number|null} intValue The integer value.
   * @param {number|null} doubleValue The double value.
   * @param {string|null} stringValue The string value.
   */
  constructor(intValue, doubleValue, stringValue) {
    this._intValue = intValue;

    this._doubleValue = doubleValue;

    this._stringValue = stringValue;
  }

  /**
   * Returns the integer value of this symbol.
   *
   * @return {number|null} The integer value.
   */
  get intValue() {
    return this._intValue;
  }

  /**
   * Returns the double value of this symbol.
   *
   * @return {number|null} The double value.
   */
  get doubleValue() {
    return this._doubleValue;
  }

  /**
   * Returns the string value of this symbol.
   *
   * @return {string|null} The string value.
   */
  get stringValue() {
    return this._stringValue;
  }

  /**
   * Retrieves the primary value of this symbol. The primary value is descriptive raw value.
   * It is either the string value, the integer value or the double value, prioritized in this order.
   *
   * @return {number|string|null} The primary value.
   */
  toPrimaryValue() {
    if (null != this._stringValue) {
      return this._stringValue;
    } else if (null != this._intValue) {
      return this._intValue;
    } else if (null != this._doubleValue) {
      return this._doubleValue;
    } else {
      return null;
    }
  }

  /**
   * Converts the symbol to its byte representation.
   *
   * @return {Buffer} The byte representation of the symbol.
   */
  toByteRepresentation() {
    if (this._intValue !== null && this._stringValue !== null) {
      const intBuffer = Buffer.alloc(4);
      intBuffer.writeInt32LE(this._intValue);

      // @ts-ignore - Buffer.concat type compatibility
      const stringBuffer = Buffer.concat([Buffer.from(this._stringValue, 'utf-8'), Buffer.from([0])]);

      // @ts-ignore - Buffer.concat type compatibility
      return Buffer.concat([Buffer.from([5]), intBuffer, stringBuffer]);
    } else if (this._doubleValue !== null && this._stringValue !== null) {
      const floatBuffer = Buffer.alloc(8);
      floatBuffer.writeDoubleLE(this._doubleValue);

      // @ts-ignore - Buffer.concat type compatibility
      const stringBuffer = Buffer.concat([Buffer.from(this._stringValue, 'utf-8'), Buffer.from([0])]);

      // @ts-ignore - Buffer.concat type compatibility
      return Buffer.concat([Buffer.from([6]), floatBuffer, stringBuffer]);
    } else if (this._intValue !== null) {
      const buffer = Buffer.alloc(4);
      buffer.writeInt32LE(this._intValue);

      // @ts-ignore - Buffer.concat type compatibility
      return Buffer.concat([Buffer.from([1]), buffer]);
    } else if (this._doubleValue !== null) {
      const buffer = Buffer.alloc(8);
      buffer.writeDoubleLE(this._doubleValue);

      // @ts-ignore - Buffer.concat type compatibility
      return Buffer.concat([Buffer.from([2]), buffer]);
    } else if (this._stringValue !== null) {
      // @ts-ignore - Buffer.concat type compatibility
      const buffer = Buffer.concat([Buffer.from(this._stringValue, 'utf-8'), Buffer.from([0])]);

      // @ts-ignore - Buffer.concat type compatibility
      return Buffer.concat([Buffer.from([4]), buffer]);
    } else {
      throw new QvdValidationError('The symbol does not contain any value.', {
        intValue: this._intValue,
        doubleValue: this._doubleValue,
        stringValue: this._stringValue,
      });
    }
  }

  /**
   * Checks if this symbol is equal to another symbol.
   *
   * @param {*} value The object to compare with.
   * @return {boolean} True if the objects are equal, false otherwise.
   */
  equals(value) {
    if (!(value instanceof QvdSymbol)) {
      return false;
    }

    return (
      this._intValue === value.intValue &&
      this._doubleValue === value.doubleValue &&
      this._stringValue === value.stringValue
    );
  }

  /**
   * Constructs a pure integer value symbol.
   *
   * @param {number} intValue The integer value.
   * @return {QvdSymbol} The constructed value symbol.
   */
  static fromIntValue(intValue) {
    return new QvdSymbol(intValue, null, null);
  }

  /**
   * Constructs a pure double value symbol.
   *
   * @param {number} doubleValue The double value.
   * @return {QvdSymbol} The constructed value symbol.
   */
  static fromDoubleValue(doubleValue) {
    return new QvdSymbol(null, doubleValue, null);
  }

  /**
   * Constructs a pure string value symbol.
   *
   * @param {string} stringValue The string value.
   * @return {QvdSymbol} The constructed value symbol.
   */
  static fromStringValue(stringValue) {
    return new QvdSymbol(null, null, stringValue);
  }

  /**
   * Constructs a dual value symbol from an integer and a string value.
   *
   * @param {number} intValue The integer value.
   * @param {string} stringValue The string value.
   * @return {QvdSymbol} The constructed value symbol.
   */
  static fromDualIntValue(intValue, stringValue) {
    return new QvdSymbol(intValue, null, stringValue);
  }

  /**
   * Constructs a dual value symbol from a double and a string value.
   *
   * @param {number} doubleValue The double value.
   * @param {string} stringValue The string value.
   * @return {QvdSymbol} The constructed value symbol.
   */
  static fromDualDoubleValue(doubleValue, stringValue) {
    return new QvdSymbol(null, doubleValue, stringValue);
  }
}
