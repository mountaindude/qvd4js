# qvd4js

> Utility library for reading/writing Qlik View Data (QVD) files in JavaScript.

The _qvd4js_ library provides a simple API for reading/writing Qlik View Data (QVD) files in JavaScript. Using
this library, it is possible to parse the binary QVD file format and convert it to a JavaScript object
structure and vica versa. The library is written to be used in a Node.js environment exclusively.

---

- [Install](#install)
- [Usage](#usage)
- [QVD File Format](#qvd-file-format)
  - [XML Header](#xml-header)
  - [Symbol Table](#symbol-table)
  - [Index Table](#index-table)
- [API Documentation](#api-documentation)
  - [QvdDataFrame](#qvddataframe)
    - [`static fromQvd(path: string): Promise<QvdDataFrame>`](#static-fromqvdpath-string-promiseqvddataframe)
    - [`static fromDict(dict: object): Promise<QvdDataFrame>`](#static-fromdictdict-object-promiseqvddataframe)
    - [`head(n: number): QvdDataFrame`](#headn-number-qvddataframe)
    - [`tail(n: number): QvdDataFrame`](#tailn-number-qvddataframe)
    - [`rows(...args: number): QvdDataFrame`](#rowsargs-number-qvddataframe)
    - [`at(row: number, column: string): any`](#atrow-number-column-string-any)
    - [`select(...args: string): QvdDataFrame`](#selectargs-string-qvddataframe)
    - [`toDict(): Promise<object>`](#todict-promiseobject)
    - [`toQvd(path: string): Promise<void>`](#toqvdpath-string-promisevoid)
    - [`getFieldMetadata(fieldName: string): object | null`](#getfieldmetadatafieldname-string-object--null)
    - [`getAllFieldMetadata(): object[]`](#getallfieldmetadata-object)
    - [`setFileMetadata(metadata: object): void`](#setfilemetadatametadata-object-void)
    - [`setFieldMetadata(fieldName: string, metadata: object): void`](#setfieldmetadatafieldname-string-metadata-object-void)
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

## Usage

Below is a quick example how to use _qvd4js_.

```javascript
import {QvdDataFrame} from 'qvd4js';

const df = await QvdDataFrame.fromQvd('path/to/file.qvd');
console.log(df.head(5));
```

The above example loads the _qvd4js_ library and parses an example QVD file. A QVD file is typically loaded using the static
`QvdDataFrame.fromQvd` function of the `QvdDataFrame` class itself. After loading the file's content, numerous methods and properties are available to work with the parsed data.

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
allFields.forEach(field => {
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
| `fileMetadata` | `object`   | File-level metadata from the QVD header (qvBuildNo, tableName, createUtcTime, etc.).                              |

#### `static fromQvd(path: string): Promise<QvdDataFrame>`

The static method `QvdDataFrame.fromQvd` loads a QVD file from the given path and parses it. The method returns a promise that resolves
to a `QvdDataFrame` instance.

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

#### `toQvd(path: string): Promise<void>`

The method `toQvd` writes the data frame to a QVD file at the specified path.

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
