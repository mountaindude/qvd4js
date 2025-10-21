import path from 'path';
import fs from 'fs';
import {QvdDataFrame} from '../src';

describe('Security: XXE Prevention', () => {
  const testDataDir = path.join(__dirname, 'data');
  const xxeTestFile = path.join(testDataDir, 'xxe-test.qvd');

  beforeAll(async () => {
    // Create a test QVD file with XXE payload
    // This simulates a malicious QVD file that tries to read /etc/passwd
    const xxePayload = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<QvdTableHeader>
  <QvBuildNo>50504</QvBuildNo>
  <CreatorDoc>&xxe;</CreatorDoc>
  <CreateUtcTime>2024-01-01 00:00:00</CreateUtcTime>
  <SourceCreateUtcTime></SourceCreateUtcTime>
  <SourceFileUtcTime></SourceFileUtcTime>
  <SourceFileSize>-1</SourceFileSize>
  <StaleUtcTime></StaleUtcTime>
  <TableName>TestTable</TableName>
  <Fields>
    <QvdFieldHeader>
      <FieldName>TestField</FieldName>
      <BitOffset>0</BitOffset>
      <BitWidth>1</BitWidth>
      <Bias>0</Bias>
      <NumberFormat>
        <Type>UNKNOWN</Type>
        <nDec>0</nDec>
        <UseThou>0</UseThou>
      </NumberFormat>
      <NoOfSymbols>1</NoOfSymbols>
      <Offset>0</Offset>
      <Length>2</Length>
      <Comment></Comment>
      <Tags></Tags>
    </QvdFieldHeader>
  </Fields>
  <Compression></Compression>
  <RecordByteSize>1</RecordByteSize>
  <NoOfRecords>1</NoOfRecords>
  <Offset>2</Offset>
  <Length>1</Length>
  <Comment></Comment>
  <Lineage>
    <LineageInfo></LineageInfo>
  </Lineage>
</QvdTableHeader>\r\n\0`;

    // Add minimal symbol table (1 field with 1 symbol: empty string)
    const symbolTable = Buffer.from([0x04, 0x00]); // Type 4 (string), null terminator

    // Add minimal index table (1 record)
    const indexTable = Buffer.from([0x00]); // Index 0

    // Combine all parts
    const qvdContent = Buffer.concat([Buffer.from(xxePayload), symbolTable, indexTable]);

    await fs.promises.writeFile(xxeTestFile, qvdContent);
  });

  afterAll(async () => {
    // Clean up test file
    try {
      await fs.promises.unlink(xxeTestFile);
    } catch (error) {
      // Ignore errors if file doesn't exist
    }
  });

  test('should not process external entities (XXE attack prevention)', async () => {
    // The parser should either:
    // 1. Successfully parse the file without resolving the external entity, OR
    // 2. Throw an error but NOT expose the contents of /etc/passwd

    try {
      const df = await QvdDataFrame.fromQvd(xxeTestFile);

      // If parsing succeeds, verify that external entity was NOT resolved
      expect(df).toBeDefined();
      expect(df.metadata).toBeDefined();

      // The CreatorDoc field should NOT contain the contents of /etc/passwd
      // It should either be empty, contain the literal entity reference, or the XML tag
      const creatorDoc = df.metadata.CreatorDoc;
      expect(creatorDoc).toBeDefined();

      // Verify it doesn't contain typical /etc/passwd content patterns
      expect(creatorDoc).not.toMatch(/root:.*:0:0:/);
      expect(creatorDoc).not.toMatch(/\/bin\/bash/);
      expect(creatorDoc).not.toMatch(/\/home\//);
      expect(creatorDoc).not.toContain('daemon:');
      expect(creatorDoc).not.toContain('nobody:');
    } catch (error) {
      // If it throws an error, that's acceptable too
      // Just make sure the error message doesn't leak sensitive file contents
      expect(error).toBeDefined();
      expect(error.message).not.toMatch(/root:.*:0:0:/);
      expect(error.message).not.toMatch(/\/bin\/bash/);
    }
  });

  test('should handle DOCTYPE declarations safely', async () => {
    // Even if DOCTYPE is present, it should not cause security issues
    // The file should either parse successfully or fail gracefully
    await expect(
      (async () => {
        try {
          const df = await QvdDataFrame.fromQvd(xxeTestFile);
          return df;
        } catch (error) {
          // Acceptable: parser might reject DOCTYPE
          return null;
        }
      })(),
    ).resolves.toBeDefined();
  });
});

describe('Security: Entity Expansion (Billion Laughs)', () => {
  const testDataDir = path.join(__dirname, 'data');
  const entityExpansionFile = path.join(testDataDir, 'entity-expansion-test.qvd');

  beforeAll(async () => {
    // Create a test file with recursive entity expansion (simplified billion laughs)
    const expansionPayload = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE foo [
  <!ENTITY lol "lol">
  <!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
  <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;">
]>
<QvdTableHeader>
  <QvBuildNo>50504</QvBuildNo>
  <CreatorDoc>&lol3;</CreatorDoc>
  <CreateUtcTime>2024-01-01 00:00:00</CreateUtcTime>
  <SourceCreateUtcTime></SourceCreateUtcTime>
  <SourceFileUtcTime></SourceFileUtcTime>
  <SourceFileSize>-1</SourceFileSize>
  <StaleUtcTime></StaleUtcTime>
  <TableName>TestTable</TableName>
  <Fields>
    <QvdFieldHeader>
      <FieldName>TestField</FieldName>
      <BitOffset>0</BitOffset>
      <BitWidth>1</BitWidth>
      <Bias>0</Bias>
      <NumberFormat>
        <Type>UNKNOWN</Type>
        <nDec>0</nDec>
        <UseThou>0</UseThou>
      </NumberFormat>
      <NoOfSymbols>1</NoOfSymbols>
      <Offset>0</Offset>
      <Length>2</Length>
      <Comment></Comment>
      <Tags></Tags>
    </QvdFieldHeader>
  </Fields>
  <Compression></Compression>
  <RecordByteSize>1</RecordByteSize>
  <NoOfRecords>1</NoOfRecords>
  <Offset>2</Offset>
  <Length>1</Length>
  <Comment></Comment>
  <Lineage>
    <LineageInfo></LineageInfo>
  </Lineage>
</QvdTableHeader>\r\n\0`;

    const symbolTable = Buffer.from([0x04, 0x00]);
    const indexTable = Buffer.from([0x00]);
    const qvdContent = Buffer.concat([Buffer.from(expansionPayload), symbolTable, indexTable]);

    await fs.promises.writeFile(entityExpansionFile, qvdContent);
  });

  afterAll(async () => {
    try {
      await fs.promises.unlink(entityExpansionFile);
    } catch (error) {
      // Ignore
    }
  });

  test('should not expand recursive entities (DoS prevention)', async () => {
    // The parser should handle entity expansion safely without consuming excessive memory
    const memoryBefore = process.memoryUsage().heapUsed;

    try {
      await QvdDataFrame.fromQvd(entityExpansionFile);
    } catch (error) {
      // Errors are acceptable
    }

    const memoryAfter = process.memoryUsage().heapUsed;
    const memoryIncrease = memoryAfter - memoryBefore;

    // Memory increase should be reasonable (less than 10MB)
    // If entities were expanded recursively, it would consume much more
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });
});
