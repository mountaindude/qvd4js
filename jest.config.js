export default {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/benchmarks/**',
    '!jest.config.js',
    '!tsup.config.js',
    '!**/__tests__/test-utils.js',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/benchmarks/', '<rootDir>/__tests__/test-utils.js'],
  testEnvironment: 'node',
};
