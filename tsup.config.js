import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['cjs', 'esm'],
  dts: false, // Disable TypeScript declaration files for JS project
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'node20',
  treeshake: true,
});
