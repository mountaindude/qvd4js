import {QvdSymbol} from '../src';

describe('QvdSymbol Zero Value Handling', () => {
  describe('Dual Integer with Zero', () => {
    test('Should correctly serialize dual integer with zero value', () => {
      const symbol = QvdSymbol.fromDualIntValue(0, '0');
      const bytes = symbol.toByteRepresentation();

      expect(bytes).toBeDefined();
      expect(bytes[0]).toBe(5); // Type byte for dual integer

      // Verify integer part (4 bytes after type byte)
      const intValue = bytes.readInt32LE(1);
      expect(intValue).toBe(0);

      // Verify string part starts at byte 5
      const stringBytes = [];
      for (let i = 5; i < bytes.length - 1; i++) {
        stringBytes.push(bytes[i]);
      }
      const stringValue = Buffer.from(stringBytes).toString('utf-8');
      expect(stringValue).toBe('0');

      // Verify null terminator
      expect(bytes[bytes.length - 1]).toBe(0);
    });

    test('Should correctly serialize dual integer with zero and complex string', () => {
      const symbol = QvdSymbol.fromDualIntValue(0, 'Zero Value');
      const bytes = symbol.toByteRepresentation();

      expect(bytes).toBeDefined();
      expect(bytes[0]).toBe(5); // Type byte for dual integer

      const intValue = bytes.readInt32LE(1);
      expect(intValue).toBe(0);
    });
  });

  describe('Dual Double with Zero', () => {
    test('Should correctly serialize dual double with zero value', () => {
      const symbol = QvdSymbol.fromDualDoubleValue(0.0, '0.0');
      const bytes = symbol.toByteRepresentation();

      expect(bytes).toBeDefined();
      expect(bytes[0]).toBe(6); // Type byte for dual double

      // Verify double part (8 bytes after type byte)
      const doubleValue = bytes.readDoubleLE(1);
      expect(doubleValue).toBe(0.0);

      // Verify string part starts at byte 9
      const stringBytes = [];
      for (let i = 9; i < bytes.length - 1; i++) {
        stringBytes.push(bytes[i]);
      }
      const stringValue = Buffer.from(stringBytes).toString('utf-8');
      expect(stringValue).toBe('0.0');

      // Verify null terminator
      expect(bytes[bytes.length - 1]).toBe(0);
    });

    test('Should correctly serialize dual double with negative zero', () => {
      const symbol = QvdSymbol.fromDualDoubleValue(-0.0, '-0.0');
      const bytes = symbol.toByteRepresentation();

      expect(bytes).toBeDefined();
      expect(bytes[0]).toBe(6); // Type byte for dual double

      const doubleValue = bytes.readDoubleLE(1);
      expect(doubleValue).toBe(-0.0);
    });
  });

  describe('Pure Integer with Zero', () => {
    test('Should correctly serialize pure integer with zero value', () => {
      const symbol = QvdSymbol.fromIntValue(0);
      const bytes = symbol.toByteRepresentation();

      expect(bytes).toBeDefined();
      expect(bytes.length).toBe(5); // 1 type byte + 4 integer bytes
      expect(bytes[0]).toBe(1); // Type byte for pure integer

      const intValue = bytes.readInt32LE(1);
      expect(intValue).toBe(0);
    });

    test('Should correctly handle primary value for zero integer', () => {
      const symbol = QvdSymbol.fromIntValue(0);
      expect(symbol.toPrimaryValue()).toBe(0);
    });
  });

  describe('Pure Double with Zero', () => {
    test('Should correctly serialize pure double with zero value', () => {
      const symbol = QvdSymbol.fromDoubleValue(0.0);
      const bytes = symbol.toByteRepresentation();

      expect(bytes).toBeDefined();
      expect(bytes.length).toBe(9); // 1 type byte + 8 double bytes
      expect(bytes[0]).toBe(2); // Type byte for pure double

      const doubleValue = bytes.readDoubleLE(1);
      expect(doubleValue).toBe(0.0);
    });

    test('Should correctly handle primary value for zero double', () => {
      const symbol = QvdSymbol.fromDoubleValue(0.0);
      expect(symbol.toPrimaryValue()).toBe(0.0);
    });

    test('Should correctly serialize negative zero double', () => {
      const symbol = QvdSymbol.fromDoubleValue(-0.0);
      const bytes = symbol.toByteRepresentation();

      expect(bytes).toBeDefined();
      expect(bytes[0]).toBe(2); // Type byte for pure double

      const doubleValue = bytes.readDoubleLE(1);
      expect(doubleValue).toBe(-0.0);
    });
  });

  describe('Edge Cases with Zero', () => {
    test('Should differentiate between zero integer and empty string', () => {
      const intSymbol = QvdSymbol.fromIntValue(0);
      const stringSymbol = QvdSymbol.fromStringValue('');

      const intBytes = intSymbol.toByteRepresentation();
      const stringBytes = stringSymbol.toByteRepresentation();

      expect(intBytes[0]).toBe(1); // Type byte for integer
      expect(stringBytes[0]).toBe(4); // Type byte for string
      expect(intBytes.length).not.toBe(stringBytes.length);
    });

    test('Should handle dual values where only numeric is zero', () => {
      const symbol = QvdSymbol.fromDualIntValue(0, 'Not Zero');
      const bytes = symbol.toByteRepresentation();

      expect(bytes[0]).toBe(5); // Type byte for dual integer
      const intValue = bytes.readInt32LE(1);
      expect(intValue).toBe(0);
    });

    test('Should correctly compare zero value symbols', () => {
      const symbol1 = QvdSymbol.fromIntValue(0);
      const symbol2 = QvdSymbol.fromIntValue(0);
      const symbol3 = QvdSymbol.fromIntValue(1);

      expect(symbol1.equals(symbol2)).toBe(true);
      expect(symbol1.equals(symbol3)).toBe(false);
    });
  });

  describe('Regression Tests - Non-Zero Values', () => {
    test('Should still work correctly for positive integer', () => {
      const symbol = QvdSymbol.fromIntValue(42);
      const bytes = symbol.toByteRepresentation();

      expect(bytes[0]).toBe(1);
      expect(bytes.readInt32LE(1)).toBe(42);
    });

    test('Should still work correctly for dual integer with non-zero', () => {
      const symbol = QvdSymbol.fromDualIntValue(42, 'forty-two');
      const bytes = symbol.toByteRepresentation();

      expect(bytes[0]).toBe(5);
      expect(bytes.readInt32LE(1)).toBe(42);
    });

    test('Should still work correctly for dual double with non-zero', () => {
      const symbol = QvdSymbol.fromDualDoubleValue(3.14, '3.14');
      const bytes = symbol.toByteRepresentation();

      expect(bytes[0]).toBe(6);
      expect(bytes.readDoubleLE(1)).toBeCloseTo(3.14);
    });
  });
});
