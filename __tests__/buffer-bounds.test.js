import path from 'path';
import fs from 'fs';
import xml from 'xml2js';
import {QvdDataFrame, QvdCorruptedError} from '../src';

describe('Buffer Bounds Checking', () => {
  let validQvdPath;
  let validBuffer;
  let validHeader;
  const createdFiles = [];

  beforeAll(async () => {
    // Load a valid QVD file to use as a base for creating malicious variants
    validQvdPath = path.join(__dirname, 'data/small.qvd');
    validBuffer = await fs.promises.readFile(validQvdPath);

    const HEADER_DELIMITER = '\r\n\0';
    const headerDelimiterIndex = validBuffer.indexOf(HEADER_DELIMITER);
    const headerEndIndex = headerDelimiterIndex + HEADER_DELIMITER.length;
    const headerBuffer = validBuffer.subarray(0, headerEndIndex);

    validHeader = await xml.parseStringPromise(headerBuffer.toString(), {explicitArray: false});
  });

  afterEach(async () => {
    // Clean up created test files
    for (const file of createdFiles) {
      try {
        await fs.promises.unlink(file);
      } catch (error) {
        // Ignore errors if file doesn't exist
      }
    }
    createdFiles.length = 0;
  });

  describe('Symbol Table Bounds Checking', () => {
    test('should reject QVD with negative symbol offset', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      let fields = maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'];
      if (!Array.isArray(fields)) {
        fields = [fields];
        maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'] = fields;
      }
      fields[0]['Offset'] = '-100';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Invalid symbol offset',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });

    test('should reject QVD with negative symbol length', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      let fields = maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'];
      if (!Array.isArray(fields)) {
        fields = [fields];
        maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'] = fields;
      }
      fields[0]['Length'] = '-50';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Invalid symbol length',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });

    test('should reject QVD with symbol offset beyond buffer', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      let fields = maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'];
      if (!Array.isArray(fields)) {
        fields = [fields];
        maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'] = fields;
      }
      // Set offset to a huge value that exceeds buffer
      fields[0]['Offset'] = '999999999';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Symbol data extends beyond buffer',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });

    test('should reject QVD with symbol length extending beyond buffer', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      let fields = maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'];
      if (!Array.isArray(fields)) {
        fields = [fields];
        maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'] = fields;
      }
      // Set length to a huge value
      fields[0]['Length'] = '999999999';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Symbol data extends beyond buffer',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });

    test('should reject QVD with NaN symbol offset', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      let fields = maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'];
      if (!Array.isArray(fields)) {
        fields = [fields];
        maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'] = fields;
      }
      fields[0]['Offset'] = 'not-a-number';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Invalid symbol offset',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });

    test('should reject QVD with NaN symbol length', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      let fields = maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'];
      if (!Array.isArray(fields)) {
        fields = [fields];
        maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'] = fields;
      }
      fields[0]['Length'] = 'invalid';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Invalid symbol length',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });
  });

  describe('Index Table Bounds Checking', () => {
    test('should reject QVD with negative record byte size', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      maliciousHeader['QvdTableHeader']['RecordByteSize'] = '-10';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Invalid record byte size',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });

    test('should reject QVD with NaN record byte size', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      maliciousHeader['QvdTableHeader']['RecordByteSize'] = 'invalid';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Invalid record byte size',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });

    test('should reject QVD with excessively large record byte size', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      // Set to more than 1MB
      maliciousHeader['QvdTableHeader']['RecordByteSize'] = '2000000';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Record byte size exceeds maximum',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });

    test('should reject QVD with negative number of records', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      maliciousHeader['QvdTableHeader']['NoOfRecords'] = '-100';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Invalid number of records',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });

    test('should reject QVD with negative index table length', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      maliciousHeader['QvdTableHeader']['Length'] = '-500';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Invalid index table length',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });

    test('should reject QVD with unreasonably large index table length', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      // Set to a value way beyond reasonable (more than 100MB beyond buffer)
      maliciousHeader['QvdTableHeader']['Length'] = '999999999999';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Index table length unreasonably large',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });

    test('should reject QVD with negative bit offset', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      let fields = maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'];
      if (!Array.isArray(fields)) {
        fields = [fields];
        maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'] = fields;
      }
      fields[0]['BitOffset'] = '-5';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Invalid bit offset',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });

    test('should reject QVD with negative bit width', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      let fields = maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'];
      if (!Array.isArray(fields)) {
        fields = [fields];
        maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'] = fields;
      }
      fields[0]['BitWidth'] = '-8';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Invalid bit width',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });

    test('should reject QVD with bit field extending beyond record size', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      let fields = maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'];
      if (!Array.isArray(fields)) {
        fields = [fields];
        maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'] = fields;
      }
      // Set bit offset + bit width to exceed record size
      const recordSize = parseInt(maliciousHeader['QvdTableHeader']['RecordByteSize'], 10);
      fields[0]['BitOffset'] = String(recordSize * 8 - 4);
      fields[0]['BitWidth'] = '10'; // This would extend beyond record

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(maliciousQvd)).rejects.toMatchObject({
        message: 'Bit field extends beyond record size',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });
  });

  describe('Error Context Information', () => {
    test('should include field name in symbol offset error context', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      let fields = maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'];
      if (!Array.isArray(fields)) {
        fields = [fields];
        maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'] = fields;
      }
      const fieldName = fields[0]['FieldName'];
      fields[0]['Offset'] = '-100';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      try {
        await QvdDataFrame.fromQvd(maliciousQvd);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.context.field).toBe(fieldName);
        expect(error.context.file).toBeDefined();
        expect(error.context.stage).toBe('parseSymbolTable');
      }
    });

    test('should include buffer size in overflow error context', async () => {
      const maliciousHeader = JSON.parse(JSON.stringify(validHeader));
      let fields = maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'];
      if (!Array.isArray(fields)) {
        fields = [fields];
        maliciousHeader['QvdTableHeader']['Fields']['QvdFieldHeader'] = fields;
      }
      fields[0]['Length'] = '999999999';

      const maliciousQvd = await createMaliciousQvd(maliciousHeader, validBuffer, createdFiles);

      try {
        await QvdDataFrame.fromQvd(maliciousQvd);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.context.bufferSize).toBeDefined();
        expect(error.context.length).toBeDefined();
        expect(error.context.offset).toBeDefined();
      }
    });
  });

  describe('Valid QVD Files', () => {
    test('should successfully load valid QVD file', async () => {
      const df = await QvdDataFrame.fromQvd(validQvdPath);

      expect(df).toBeDefined();
      expect(df.shape).toBeDefined();
      expect(df.columns).toBeDefined();
      expect(df.shape[0]).toBeGreaterThan(0);
    });
  });

  describe('Header Delimiter Edge Cases', () => {
    test('should correctly handle header delimiter at position 0', async () => {
      // This test verifies the fix for the issue where indexOf returning 0
      // was incorrectly treated as falsy and causing an error
      const HEADER_DELIMITER = '\r\n\0';

      // Create a minimal valid header that starts immediately at position 0
      const builder = new xml.Builder();
      const minimalHeader = {
        QvdTableHeader: {
          QvBuildNo: '50879',
          CreatorDoc: 'test.qvw',
          CreateUtcTime: '2024-01-01 00:00:00',
          TableName: 'TestTable',
          Fields: {
            QvdFieldHeader: {
              FieldName: 'TestField',
              BitOffset: '0',
              BitWidth: '1',
              Bias: '0',
              NumberFormat: {Type: 'UNKNOWN'},
              NoOfSymbols: '1',
              Offset: '0',
              Length: '5',
              Comment: '',
            },
          },
          NoOfRecords: '1',
          Offset: '5',
          Length: '1',
          RecordByteSize: '1',
          Comment: '',
        },
      };

      const headerXml = builder.buildObject(minimalHeader);
      const headerBuffer = Buffer.from(headerXml + HEADER_DELIMITER);

      // Create minimal symbol table (1 symbol: type byte 1 (int) + 4 bytes for value 0)
      const symbolBuffer = Buffer.alloc(5);
      symbolBuffer[0] = 1; // Type byte for integer
      symbolBuffer.writeInt32LE(0, 1); // Value 0

      // Create minimal index table (1 record, 1 byte)
      const indexBuffer = Buffer.alloc(1);
      indexBuffer[0] = 0;

      // Combine all parts
      const qvdBuffer = Buffer.concat([headerBuffer, symbolBuffer, indexBuffer]);

      // Write to temp file
      const tempPath = path.join(__dirname, 'data', `test-delimiter-at-zero-${Date.now()}.qvd`);
      await fs.promises.writeFile(tempPath, qvdBuffer);
      createdFiles.push(tempPath);

      // This should not throw an error even though delimiter index is 0
      // (which was the bug - it was checking !headerDelimiterIndex instead of headerDelimiterIndex === -1)
      await expect(QvdDataFrame.fromQvd(tempPath)).resolves.toBeDefined();

      // Verify the file loads successfully
      const df = await QvdDataFrame.fromQvd(tempPath);
      expect(df).toBeDefined();
      expect(df.columns).toEqual(['TestField']);
      expect(df.shape[0]).toBe(1);
    });

    test('should throw error when header delimiter is truly missing', async () => {
      // Create a buffer without the header delimiter to ensure proper error handling
      const invalidBuffer = Buffer.from('<?xml version="1.0"?><QvdTableHeader><TableName>Test</TableName></QvdTableHeader>');

      const tempPath = path.join(__dirname, 'data', `test-missing-delimiter-${Date.now()}.qvd`);
      await fs.promises.writeFile(tempPath, invalidBuffer);
      createdFiles.push(tempPath);

      // This should throw an error because the delimiter is actually missing
      await expect(QvdDataFrame.fromQvd(tempPath)).rejects.toThrow(QvdCorruptedError);
      await expect(QvdDataFrame.fromQvd(tempPath)).rejects.toMatchObject({
        message: 'The XML header section does not exist or is not properly delimited from the binary data.',
        code: 'QVD_CORRUPTED_ERROR',
      });
    });
  });
});

/**
 * Helper function to create a malicious QVD file with modified header
 * @param {Object} header - Modified header object
 * @param {Buffer} originalBuffer - Original QVD buffer
 * @param {Array<string>} fileTracker - Array to track created files for cleanup
 * @return {Promise<string>} Path to the created malicious QVD file
 */
async function createMaliciousQvd(header, originalBuffer, fileTracker) {
  const HEADER_DELIMITER = '\r\n\0';

  // Convert header back to XML
  const builder = new xml.Builder();
  const headerXml = builder.buildObject(header);

  // Create new buffer with malicious header and original binary data
  const headerDelimiterIndex = originalBuffer.indexOf(HEADER_DELIMITER);
  const originalHeaderEndIndex = headerDelimiterIndex + HEADER_DELIMITER.length;

  const newHeaderBuffer = Buffer.from(headerXml + HEADER_DELIMITER);
  const binaryDataBuffer = originalBuffer.subarray(originalHeaderEndIndex);

  const maliciousBuffer = Buffer.concat([newHeaderBuffer, binaryDataBuffer]);

  // Write to temp file in the test data directory to avoid path security issues
  const tempPath = path.join(__dirname, 'data', `malicious-${Date.now()}-${Math.random().toString(36).substring(7)}.qvd`);
  await fs.promises.writeFile(tempPath, maliciousBuffer);

  // Track file for cleanup
  fileTracker.push(tempPath);

  return tempPath;
}
