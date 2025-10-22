import {Bench} from 'tinybench';
import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';
import {QvdDataFrame} from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if running in CI mode (output to file)
const isCI = process.argv.includes('--ci');

const bench = new Bench({time: 1000});

bench
  .add('Parse small QVD (~600 rows)', async () => {
    await QvdDataFrame.fromQvd(path.join(__dirname, '../__tests__/data/small.qvd'));
  })
  .add('Parse medium QVD (~18k rows)', async () => {
    await QvdDataFrame.fromQvd(path.join(__dirname, '../__tests__/data/medium.qvd'));
  })
  .add('Parse large QVD (~60k rows)', async () => {
    await QvdDataFrame.fromQvd(path.join(__dirname, '../__tests__/data/large.qvd'));
  })
  .add('Parse with maxRows=100 (lazy loading)', async () => {
    await QvdDataFrame.fromQvd(path.join(__dirname, '../__tests__/data/medium.qvd'), {maxRows: 100});
  })
  .add('Parse with maxRows=1000 (lazy loading)', async () => {
    await QvdDataFrame.fromQvd(path.join(__dirname, '../__tests__/data/large.qvd'), {maxRows: 1000});
  });

await bench.run();

// Export for CI consumption in github-action-benchmark format
const results = bench.tasks.map((task) => ({
  name: task.name,
  unit: 'ops/sec',
  value: task.result.hz || 0,
  range: task.result.rme ? `±${task.result.rme.toFixed(2)}%` : 'N/A',
  extra: `${task.result.samples ? task.result.samples.length : 0} samples`,
}));

if (isCI) {
  // CI mode: Write JSON directly to file
  const outputPath = path.join(__dirname, '../benchmark-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Benchmark results written to ${outputPath}`);
} else {
  // Interactive mode: Show table and JSON
  console.table(bench.table());
  console.log('\n--- Benchmark Results (JSON) ---');
  console.log(JSON.stringify(results, null, 2));
}
