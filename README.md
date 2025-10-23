# qvd4js

> Utility library for reading/writing Qlik View Data (QVD) files in JavaScript.

The _qvd4js_ library provides a simple API for reading/writing Qlik View Data (QVD) files in JavaScript.

Using this library, it is possible to parse the binary QVD file format and convert it to a JavaScript object
structure and vice versa. The library is written to be used in a Node.js environment exclusively.

---

- [qvd4js](#qvd4js)
  - [Install](#install)
  - [Usage](#usage)
    - [Lazy Loading](#lazy-loading)
    - [Progress Tracking for Large File Writes](#progress-tracking-for-large-file-writes)
    - [Working with Metadata](#working-with-metadata)
    - [Security Considerations](#security-considerations)
  - [QVD File Format](#qvd-file-format)
    - [XML Header](#xml-header)
    - [Symbol Table](#symbol-table)
    - [Index Table](#index-table)
  - [API Documentation](#api-documentation)
    - [QvdDataFrame](#qvddataframe)
      - [`static fromQvd(path: string, options?: object): Promise<QvdDataFrame>`](#static-fromqvdpath-string-options-object-promiseqvddataframe)
      - [`static fromDict(dict: object): Promise<QvdDataFrame>`](#static-fromdictdict-object-promiseqvddataframe)
      - [`head(n: number): QvdDataFrame`](#headn-number-qvddataframe)
      - [`tail(n: number): QvdDataFrame`](#tailn-number-qvddataframe)
      - [`rows(...args: number): QvdDataFrame`](#rowsargs-number-qvddataframe)
      - [`at(row: number, column: string): any`](#atrow-number-column-string-any)
      - [`select(...args: string): QvdDataFrame`](#selectargs-string-qvddataframe)
      - [`toDict(): Promise<object>`](#todict-promiseobject)
      - [`toQvd(path: string, options?: object): Promise<void>`](#toqvdpath-string-options-object-promisevoid)
      - [`getFieldMetadata(fieldName: string): object | null`](#getfieldmetadatafieldname-string-object--null)
      - [`getAllFieldMetadata(): object[]`](#getallfieldmetadata-object)
      - [`setFileMetadata(metadata: object): void`](#setfilemetadatametadata-object-void)
      - [`setFieldMetadata(fieldName: string, metadata: object): void`](#setfieldmetadatafieldname-string-metadata-object-void)
  - [Testing](#testing)
    - [Running Tests](#running-tests)
  - [Contributors](#contributors)
  - [License](#license)
    - [Forbidden](#forbidden)

---

## Install

_qvd4js_ is a Node.js module available through [npm](https://www.npmjs.com/). The recommended way to install and maintain _qvd4js_ as a dependency is through the Node.js Package Manager (NPM).
Before installing this library, download and install Node.js.

You can get _qvd4js_ using the following command:

```bash
npm install qvd4js --save
```

**Module Format Support:**
This library is published as a **dual ESM/CJS package**, providing full compatibility with both modern ES modules and traditional CommonJS environments:

- ✅ **ESM (ES Modules)**: Native `import` statements in Node.js and modern bundlers
- ✅ **CommonJS**: Traditional `require()` for compatibility with older Node.js projects
- ✅ **TypeScript**: Full compatibility with TypeScript projects (both module systems)
- ✅ **Bundlers**: Works with Webpack, Vite, Rollup, esbuild, and other modern build tools

**Usage Examples:**

```javascript
// ESM (ES Modules) - Modern Node.js and TypeScript
import {QvdDataFrame} from 'qvd4js';

// CommonJS - Traditional Node.js
const {QvdDataFrame} = require('qvd4js');
```

The package automatically provides the correct format based on your project's configuration.

## Usage

Below is a quick example how to use _qvd4js_.

```javascript
import {QvdDataFrame} from 'qvd4js';

const df = await QvdDataFrame.fromQvd('path/to/file.qvd');
console.log(df.head(5));
```

The above example loads the _qvd4js_ library and parses an example QVD file. A QVD file is typically loaded using the static
`QvdDataFrame.fromQvd` function of the `QvdDataFrame` class itself. After loading the file's content, numerous methods and properties are available to work with the parsed data.

### Lazy Loading

For large QVD files, you can load only a specific number of rows to improve performance and reduce memory usage. The library implements **true lazy loading** - it reads only the necessary portions of the file from disk, not the entire file.

```javascript
import {QvdDataFrame} from 'qvd4js';

// Load only the first 1000 rows
const df = await QvdDataFrame.fromQvd('path/to/file.qvd', {maxRows: 1000});
console.log(df.shape); // [1000, numberOfColumns]
```

**How it works:**

- The library reads only the header, symbol table, and the first N rows from the index table
- For a 5 GB file with `maxRows: 25`, only about 35-40% of the file is read from disk (~1.75-2 GB)
- This provides significant memory savings and faster loading times for large files

This is particularly useful for:

- Previewing data from very large QVD files without loading the entire file into memory
- Reducing memory consumption when working with multi-gigabyte files
- Faster loading times when you only need a subset of the data
- Data exploration and schema inspection of large datasets

### Progress Tracking for Large File Writes

When writing large QVD files (e.g., 100K+ rows), the `toQvd()` operation can take significant time. The library provides optional progress callbacks to track the write operation in real-time:

```javascript
import {QvdDataFrame} from 'qvd4js';

const df = await QvdDataFrame.fromDict({
  columns: ['ID', 'Name', 'Value'],
  data: largeDataArray, // e.g., 100,000+ rows
});

await df.toQvd('output.qvd', {
  onProgress: (progress) => {
    console.log(`${progress.stage}: ${progress.percent}% complete`);
  },
});
```

**Progress stages:**

- `symbol-table`: Building unique value tables for each column
- `index-table`: Processing all data rows and creating index mappings
- `header`: Generating XML header metadata
- `write`: Writing data to disk

**Performance optimizations:**

The library uses optimized algorithms for large dataset processing:

- **Single-pass symbol table building**: All columns are processed in one pass through the data (previously required one pass per column)
- **Map-based lookups**: O(1) symbol index lookups instead of O(n) findIndex operations
- **Reduced algorithmic complexity**: From O(n×m×s) to O(n×m) where n=rows, m=columns, s=symbols

These optimizations can reduce write times by 80-90% for large datasets (100K+ rows).

### Working with Metadata

The library provides full access to QVD file and field metadata:

```javascript
import {QvdDataFrame} from 'qvd4js';

// Load QVD file
const df = await QvdDataFrame.fromQvd('path/to/file.qvd');

// Access file-level metadata
console.log(df.fileMetadata.tableName);
console.log(df.fileMetadata.createUtcTime);
console.log(df.fileMetadata.noOfRecords);

// Access field-level metadata
const fieldMeta = df.getFieldMetadata('ProductKey');
console.log(fieldMeta.comment);
console.log(fieldMeta.numberFormat);
console.log(fieldMeta.tags);

// Get all field metadata
const allFields = df.getAllFieldMetadata();
allFields.forEach((field) => {
  console.log(`${field.fieldName}: ${field.noOfSymbols} symbols`);
});

// Modify metadata (only modifiable properties can be changed)
df.setFileMetadata({
  tableName: 'UpdatedProducts',
  comment: 'Modified product data',
});

df.setFieldMetadata('ProductKey', {
  comment: 'Primary key for products',
  tags: {String: ['$key', '$numeric']},
});

// Metadata is preserved when writing
await df.toQvd('path/to/output.qvd');
```

### Security Considerations

The library includes built-in protection against path traversal attacks.

**Default Security Behavior:**

By default, all file operations are restricted to the **current working directory (CWD)** and its subdirectories. This means:

- ✅ Files within CWD can be accessed: `./data/file.qvd` or `data/file.qvd`
- ❌ Files outside CWD are blocked: `/etc/passwd` or `../../../sensitive.qvd`
- ❌ Path traversal attempts are detected and blocked

This default behavior protects against path traversal attacks without requiring additional configuration.

**Custom Directory Restriction:**

You can explicitly specify a different base directory using the `allowedDir` option:

```javascript
import {QvdDataFrame} from 'qvd4js';

// Restrict reading to a specific directory
const allowedDataDir = '/var/data/qvd-files';
const df = await QvdDataFrame.fromQvd('reports/sales.qvd', {
  allowedDir: allowedDataDir,
});

// Restrict writing to a specific directory
const allowedOutputDir = '/var/output';
await df.toQvd('processed/sales-filtered.qvd', {
  allowedDir: allowedOutputDir,
});
```

**Security Features:**

- **Path Normalization**: All paths are automatically normalized using `path.resolve()` to eliminate `..` and `.` segments
- **Null Byte Protection**: Detects and blocks null byte injection attempts
- **Default CWD Restriction**: By default, file operations are restricted to the current working directory (CWD) and its subdirectories to prevent path traversal attacks
- **Custom Directory Restriction**: Optional `allowedDir` parameter allows you to specify a different base directory
- **Security Errors**: Throws `QvdSecurityError` with detailed context when security violations are detected

**Best Practices:**

1. **Understand default security**: Files are restricted to CWD by default - no additional configuration needed for basic protection
2. **Use explicit `allowedDir` in production**: When your application's CWD differs from your data directory, specify an explicit `allowedDir` for user-provided file paths
3. **Validate user input**: Even with built-in protections, validate and sanitize any user-provided paths
4. **Principle of least privilege**: Use the most restrictive `allowedDir` possible for your use case
5. **Monitor security errors**: Log and monitor `QvdSecurityError` exceptions as they may indicate attack attempts

**Examples:**

```javascript
import {QvdDataFrame, QvdSecurityError} from 'qvd4js';

// Example 1: Default behavior (restricted to CWD)
// This is safe by default - no path traversal possible
try {
  const df = await QvdDataFrame.fromQvd('data/file.qvd'); // ✅ Works (within CWD)
  const df2 = await QvdDataFrame.fromQvd('../../../etc/passwd'); // ❌ Throws QvdSecurityError
} catch (error) {
  if (error instanceof QvdSecurityError) {
    console.error('Path traversal blocked:', error.message);
  }
}

// Example 2: Custom allowedDir for specific use cases
try {
  const df = await QvdDataFrame.fromQvd(userProvidedPath, {
    allowedDir: '/safe/directory',
  });
  // Process data...
} catch (error) {
  if (error instanceof QvdSecurityError) {
    console.error('Security violation detected:', error.message);
    console.error('Context:', error.context);
    // Log security incident
  } else {
    throw error;
  }
}
```

## QVD File Format

The QVD file format is a binary file format that is used by QlikView to store data. The format is proprietary. However,
the format is well documented and can be parsed without the need of a QlikView installation. In fact, a QVD file consists
of three parts: a XML header, and two binary parts, the symbol and the index table. The XML header contains meta information
about the QVD file, such as the number of data records and the names of the fields. The symbol table contains the actual
distinct values of the fields. The index table contains the actual data records. The index table is a list of indices
which point to values in the symbol table.

### XML Header

The XML header contains meta information about the QVD file. The header is always located at the beginning of the file and
is in human readable text format. The header contains information about the number of data records, the names of the fields,
and the data types of the fields.

### Symbol Table

The symbol table contains the distinct/unique values of the fields and is located directly after the XML header. The order
of columns in the symbol table corresponds to the order of the fields in the XML header. The length and offset of the
symbol sections of each column are also stored in the XML header. Each symbol section consist of the unique symbols of the
respective column. The type of a single symbol is determined by a type byte prefixed to the respective symbol value. The
following type of symbols are supported:

| Code | Type         | Description                                                                                   |
| ---- | ------------ | --------------------------------------------------------------------------------------------- |
| 1    | Integer      | signed 4-byte integer (little endian)                                                         |
| 2    | Float        | signed 8-byte IEEE floating point number (little endian)                                      |
| 4    | String       | null terminated string                                                                        |
| 5    | Dual Integer | signed 4-byte integer (little endian) followed by a null terminated string                    |
| 6    | Dual Float   | signed 8-byte IEEE floating point number (little endian) followed by a null terminated string |

### Index Table

After the symbol table, the index table follows. The index table contains the actual data records. The index table contains
binary indices that refrences to the values of each row in the symbol table. The order of the columns in the index table
corresponds to the order of the fields in the XML header. Hence, the index table does not contain the actual values of a
data record, but only the indices that point to the values in the symbol table.

### Empty QVD Files

QVD files can be empty in the sense that they contain zero data rows while still maintaining valid field definitions and metadata. This is a valid use case in Qlik applications where table structures need to be preserved even when no data is available.

**Characteristics of Empty QVD Files:**

- **NoOfRecords**: Set to `0` in the XML header
- **RecordByteSize**: Set to `1` (following Qlik Sense's convention)
- **Fields**: Field definitions are present and complete with metadata
- **Symbol Table**: Each field has zero symbols (`NoOfSymbols=0`, `Offset=0`, `Length=0`)
- **Index Table**: Empty with `Length=0`
- **BitWidth**: Can vary per field (typically `0` or `8`)

**Example Empty QVD XML Header:**

```xml
<QvdTableHeader>
  <TableName>EmptyTable</TableName>
  <Fields>
    <QvdFieldHeader>
      <FieldName>Country</FieldName>
      <BitOffset>0</BitOffset>
      <BitWidth>0</BitWidth>
      <Bias>0</Bias>
      <NoOfSymbols>0</NoOfSymbols>
      <Offset>0</Offset>
      <Length>0</Length>
    </QvdFieldHeader>
  </Fields>
  <RecordByteSize>1</RecordByteSize>
  <NoOfRecords>0</NoOfRecords>
  <Offset>0</Offset>
  <Length>0</Length>
</QvdTableHeader>
```

**Working with Empty QVDs:**

```javascript
import {QvdDataFrame} from 'qvd4js';

// Create an empty QVD with field structure but no data
const emptyDf = new QvdDataFrame(
  [], // No data rows
  ['Country', 'Year', 'Sales'], // Column definitions
);

// Set metadata
emptyDf.setFileMetadata({
  tableName: 'EmptyTable',
  comment: 'Template table structure',
});

// Write empty QVD (compatible with Qlik Sense)
await emptyDf.toQvd('empty.qvd');

// Read it back
const loadedDf = await QvdDataFrame.fromQvd('empty.qvd');
console.log(loadedDf.shape); // [0, 3] - zero rows, three columns
console.log(loadedDf.columns); // ['Country', 'Year', 'Sales']
```

Empty QVDs are fully supported for both reading and writing, maintaining compatibility with files created by Qlik Sense and QlikView.

## API Documentation

### QvdDataFrame

The `QvdDataFrame` class represents the data frame stored inside of a finally parsed QVD file. It provides a high-level
abstraction access to the QVD file content. This includes meta information as well as access to the actual data records.

| Property       | Type       | Description                                                                                                        |
| -------------- | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `shape`        | `number[]` | The shape of the data table. The first element is the number of rows, the second element is the number of columns. |
| `data`         | `any[][]`  | The actual data records of the QVD file. The first dimension represents the single rows.                           |
| `columns`      | `string[]` | The names of the fields that are contained in the QVD file.                                                        |
| `metadata`     | `object`   | The complete metadata object from the QVD file header, or null if not loaded from a QVD file.                      |
| `fileMetadata` | `object`   | File-level metadata from the QVD header (qvBuildNo, tableName, createUtcTime, etc.).                               |

#### `static fromQvd(path: string, options?: object): Promise<QvdDataFrame>`

The static method `QvdDataFrame.fromQvd` loads a QVD file from the given path and parses it. The method returns a promise that resolves
to a `QvdDataFrame` instance.

**Parameters:**

- `path` (string): The path to the QVD file.
- `options` (object, optional): Loading options
  - `maxRows` (number, optional): Maximum number of rows to load. If not specified, all rows are loaded. This is useful for loading only a subset of data from large QVD files to improve performance and reduce memory usage.
  - `allowedDir` (string, optional): Base directory for file access validation. Defaults to current working directory (CWD). The file path must resolve to a location within this directory to prevent path traversal attacks. Set to a specific directory in production environments with user-provided paths.

**Example:**

```javascript
// Load all rows (default behavior)
const df = await QvdDataFrame.fromQvd('path/to/file.qvd');

// Load only the first 1000 rows
const dfLazy = await QvdDataFrame.fromQvd('path/to/file.qvd', {maxRows: 1000});

// Load with security restriction (recommended for production)
const dfSecure = await QvdDataFrame.fromQvd('reports/sales.qvd', {
  allowedDir: '/var/data/qvd-files',
});
```

#### `static fromDict(dict: object): Promise<QvdDataFrame>`

The static method `QvdDataFrame.fromDict` constructs a data frame from a dictionary. The dictionary must contain the columns and
the actual data as properties. The columns property is an array of strings that contains the names of the fields in the QVD file.
The data property is an array of arrays that contains the actual data records. The order of the values in the inner arrays
corresponds to the order of the fields in the QVD file.

#### `head(n: number): QvdDataFrame`

The method `head` returns the first `n` rows of the data frame.

#### `tail(n: number): QvdDataFrame`

The method `tail` returns the last `n` rows of the data frame.

#### `rows(...args: number): QvdDataFrame`

The method `rows` returns a new data frame that contains only the specified rows.

#### `at(row: number, column: string): any`

The method `at` returns the value at the specified row and column.

#### `select(...args: string): QvdDataFrame`

The method `select` returns a new data frame that contains only the specified columns.

#### `toDict(): Promise<object>`

The method `toDict` returns the data frame as a dictionary. The dictionary contains the columns and the
actual data as properties. The columns property is an array of strings that contains the names of the
fields in the QVD file. The data property is an array of arrays that contains the actual data records.
The order of the values in the inner arrays corresponds to the order of the fields in the QVD file.

#### `toQvd(path: string, options?: object): Promise<void>`

The method `toQvd` writes the data frame to a QVD file at the specified path.

**Parameters:**

- `path` (string): The path where the QVD file should be written.
- `options` (object, optional): Writing options
  - `allowedDir` (string, optional): Base directory for file write validation. Defaults to current working directory (CWD). The file path must resolve to a location within this directory to prevent path traversal attacks. Set to a specific directory in production environments with user-provided paths.
  - `onProgress` (function, optional): Progress callback function for tracking write operations. Receives progress updates during symbol table building, index table building, header generation, and data writing.

**Progress Callback:**

The `onProgress` callback receives an object with the following properties:

- `stage` (string): Current operation stage - `'symbol-table'`, `'index-table'`, `'header'`, or `'write'`
- `current` (number): Current progress value (e.g., rows processed, columns completed)
- `total` (number): Total progress value
- `percent` (number): Progress percentage (0-100)

This is particularly useful for large QVD files where write operations can take significant time.

**Examples:**

```javascript
// Write to file (default behavior)
await df.toQvd('output/data.qvd');

// Write with security restriction (recommended for production)
await df.toQvd('processed/data.qvd', {
  allowedDir: '/var/output/qvd-files',
});

// Write with progress tracking for large files
await df.toQvd('large-output.qvd', {
  onProgress: (progress) => {
    console.log(`${progress.stage}: ${progress.percent}% (${progress.current}/${progress.total})`);
  },
});

// Write with detailed progress bar
await df.toQvd('data.qvd', {
  onProgress: (progress) => {
    const bar = '█'.repeat(Math.floor(progress.percent / 2)) + '░'.repeat(50 - Math.floor(progress.percent / 2));
    process.stdout.write(`\r[${progress.stage}] ${bar} ${progress.percent}%`);
    if (progress.current === progress.total) console.log(' ✓');
  },
});
```

#### `getFieldMetadata(fieldName: string): object | null`

The method `getFieldMetadata` returns the metadata for a specific field/column from the QVD header. Returns null if the field is not found or metadata is not available.

The returned object contains:

- `fieldName`: Name of the field
- `bitOffset`: Bit offset in the index table
- `bitWidth`: Bit width in the index table
- `bias`: Bias value for index calculation
- `noOfSymbols`: Number of unique symbols/values
- `offset`: Byte offset in the symbol table
- `length`: Byte length in the symbol table
- `comment`: Field comment (modifiable)
- `numberFormat`: Number format settings (modifiable)
- `tags`: Field tags (modifiable)

Note: Properties like `offset`, `length`, `bitOffset`, `bitWidth`, `bias`, and `noOfSymbols` are immutable and relate to internal data storage.

#### `getAllFieldMetadata(): object[]`

The method `getAllFieldMetadata` returns an array of metadata objects for all fields in the data frame. Each object has the same structure as returned by `getFieldMetadata`.

#### `setFileMetadata(metadata: object): void`

The method `setFileMetadata` allows modifying file-level metadata. Only modifiable properties are updated; immutable properties related to data storage are ignored.

Modifiable properties:

- `qvBuildNo`: QlikView build number
- `creatorDoc`: Document GUID that created the QVD
- `createUtcTime`: Creation timestamp
- `sourceCreateUtcTime`: Source creation timestamp
- `sourceFileUtcTime`: Source file timestamp
- `sourceFileSize`: Source file size
- `staleUtcTime`: Stale timestamp
- `tableName`: Table name
- `compression`: Compression method
- `comment`: Table comment
- `encryptionInfo`: Encryption information
- `tableTags`: Table tags
- `profilingData`: Profiling data
- `lineage`: Data lineage information

Immutable properties (cannot be modified):

- `noOfRecords`: Number of records
- `recordByteSize`: Record byte size
- `offset`: Byte offset in file
- `length`: Byte length in file

#### `setFieldMetadata(fieldName: string, metadata: object): void`

The method `setFieldMetadata` allows modifying field-level metadata for a specific field. Only modifiable properties are updated; immutable properties related to data storage are ignored.

Modifiable properties:

- `comment`: Field comment/description
- `numberFormat`: Number format settings (Type, nDec, UseThou, Fmt, Dec, Thou)
- `tags`: Field tags (typically used for field classification)

Immutable properties (cannot be modified):

- `offset`: Byte offset in symbol table
- `length`: Byte length in symbol table
- `bitOffset`: Bit offset in index table
- `bitWidth`: Bit width in index table
- `bias`: Bias value
- `noOfSymbols`: Number of symbols

## Testing

qvd4js has comprehensive test coverage with automated multi-platform testing. For detailed information about the testing infrastructure, including:

- Test architecture and coverage breakdown
- Multi-platform support (Windows, macOS, Linux)
- Security testing approach
- Self-hosted runner setup
- Performance benchmarking

See the **[Testing Documentation](./docs/README.md)** in the `docs/` directory.

Quick links:

- **[Testing Summary](./docs/TESTING_SUMMARY.md)** - Executive overview and quick start
- **[Complete Design](./docs/MULTI_PLATFORM_TEST_DESIGN.md)** - Full technical specification

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run coverage

# Run specific test file
npm test -- __tests__/reader.test.js
```

Current test coverage: **91.7%** across 95+ tests covering unit, integration, and error handling scenarios.

## Contributors

- [Constantin Müller](https://mueller-constantin.de) - Original author
- [Göran Sander](https://github.com/mountaindude) - General refresh, improved error handling, expose all metadata from XML headers, lazy loading of symbol and index tables, ESM/CJS support, multi-platform testing, TypeScript typings, security hardening, bug fixes

## License

Copyright (c) 2024 Constantin Müller

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[MIT License](https://opensource.org/licenses/MIT) or [LICENSE](LICENSE) for
more details.

### Forbidden

**Hold Liable**: Software is provided without warranty and the software
author/license owner cannot be held liable for damages.
