# GitHub Copilot Instructions for qvd4js

## Project Overview

qvd4js is a Node.js utility library for reading and writing Qlik View Data (QVD) files in JavaScript. The library provides a simple API to parse the proprietary binary QVD file format and convert it to JavaScript objects and vice versa.

## Technology Stack

- **Language**: JavaScript (ES6+)
- **Runtime**: Node.js
- **Build Tool**: Babel (transpilation from src/ to dist/)
- **Testing**: Jest with coverage reporting
- **Linting**: ESLint with Google config and Prettier
- **Dependencies**:
  - `xml2js` - for parsing QVD XML headers
  - Standard Node.js modules: `fs`, `path`, `crypto`, `assert`

## Project Structure

```
qvd4js/
├── src/                    # Source code
│   ├── index.js           # Main entry point (exports)
│   └── qvd.js             # Core implementation
├── __tests__/             # Jest test files
│   ├── reader.test.js     # Reader tests
│   ├── writer.test.js     # Writer tests
│   └── data/              # Test QVD files
├── dist/                  # Compiled output (generated)
├── coverage/              # Test coverage reports
├── package.json           # NPM configuration
├── jest.config.js         # Jest configuration
└── README.md              # Documentation
```

## Core Architecture

### Main Classes

1. **QvdSymbol**: Represents a single value in a QVD file
   - Can contain integer, double, or string values
   - Supports dual types (integer+string or double+string)
   - Has methods for conversion to primary value and byte representation

2. **QvdDataFrame**: High-level data frame class for working with QVD data
   - Static methods: `fromQvd()`, `fromDict()`
   - Data manipulation: `head()`, `tail()`, `rows()`, `at()`, `select()`
   - Export methods: `toDict()`, `toQvd()`

3. **QvdFileReader**: Handles reading and parsing QVD files
   - Parses XML header, symbol table, and index table

4. **QvdFileWriter**: Handles writing QVD files
   - Generates proper QVD binary format

### QVD File Format

A QVD file consists of three parts:

1. **XML Header**: Meta information (field names, data types, record count)
2. **Symbol Table**: Distinct values for each column
3. **Index Table**: Binary indices referencing symbol table values

### Symbol Types (Type Byte Prefixes)

| Code | Type         | Description                    |
| ---- | ------------ | ------------------------------ |
| 1    | Integer      | 4-byte signed int (LE)         |
| 2    | Float        | 8-byte IEEE float (LE)         |
| 4    | String       | Null-terminated string         |
| 5    | Dual Integer | Int + null-terminated string   |
| 6    | Dual Float   | Float + null-terminated string |

## Coding Guidelines

### Style and Conventions

- Use ES6+ features (import/export, async/await, arrow functions)
- Follow Google JavaScript Style Guide
- Use Prettier for code formatting
- Add JSDoc comments for all public methods and classes
- Include type annotations in JSDoc (`@param`, `@return`)
- Use `// @ts-check` at the top of files for basic type checking

### Patterns to Follow

1. **Error Handling**: Use assertions for validation

   ```javascript
   assert(condition, 'Error message');
   ```

2. **Async Operations**: Use async/await for file operations

   ```javascript
   const df = await QvdDataFrame.fromQvd('path/to/file.qvd');
   ```

3. **Buffer Operations**: Use Node.js Buffer for binary data
   - Little-endian byte order for integers and floats
   - Null-terminated strings for text data

4. **Method Chaining**: Support fluent API where appropriate
   ```javascript
   df.select('field1', 'field2').head(10);
   ```

### Testing

- Write tests using Jest
- Place test files in `__tests__/` directory
- Use descriptive test names
- Maintain high test coverage (aim for >80%)
- Include test data files in `__tests__/data/`

### Build and Development

- **Build**: `npm run build` - Transpile src/ to dist/
- **Test**: `npm run test` - Run Jest with coverage
- **Lint**: `npm run lint` - Run ESLint
- **Clean**: `npm run clean` - Remove dist/ folder

## Common Tasks

### Adding a New Method to QvdDataFrame

1. Add method implementation in `src/qvd.js` in the QvdDataFrame class
2. Include comprehensive JSDoc documentation
3. Add corresponding test in `__tests__/reader.test.js` or `__tests__/writer.test.js`
4. Update README.md API documentation section
5. Run tests and ensure coverage is maintained

### Handling Binary Data

- All binary operations use little-endian byte order
- Use Buffer methods: `writeInt32LE()`, `writeDoubleLE()`, `readInt32LE()`, `readDoubleLE()`
- Always null-terminate strings in binary format
- Type byte prefixes symbol values in the symbol table

### Working with XML Headers

- Use `xml2js` library for parsing and building XML
- XML header contains field metadata (name, type, offset, length)
- XML structure mirrors QVD specification

## Important Notes

- This library is designed exclusively for Node.js (not browser-compatible)
- QVD format is proprietary to Qlik but well-documented
- Performance considerations: QVD files can be large, use streaming where possible
- Maintain backward compatibility with existing QVD files
- The main export point is `src/index.js` - all public APIs export from there

## Repository Information

- **Repository**: https://github.com/MuellerConstantin/qvd4js.git
- **License**: MIT
- **Version**: 1.0.5
- **Author**: Constantin Müller

## When Contributing

1. Ensure all tests pass: `npm run test`
2. Check linting: `npm run lint`
3. Build successfully: `npm run build`
4. Maintain or improve test coverage
5. Update documentation in README.md for any API changes
6. Follow existing code patterns and style
