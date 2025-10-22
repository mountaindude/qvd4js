import { Bench } from 'tinybench';
import path from 'path';
import { fileURLToPath } from 'url';
import { QvdDataFrame } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bench = new Bench({ time: 1000 });

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
    await QvdDataFrame.fromQvd(path.join(__dirname, '../__tests__/data/medium.qvd'), { maxRows: 100 });
  })
  .add('Parse with maxRows=1000 (lazy loading)', async () => {
    await QvdDataFrame.fromQvd(path.join(__dirname, '../__tests__/data/large.qvd'), { maxRows: 1000 });
  });

await bench.run();

console.table(bench.table());

// Export for CI consumption in github-action-benchmark format
const results = bench.tasks.map(task => ({
  name: task.name,
  unit: 'ops/sec',
  value: task.result.hz || 0,
  range: task.result.rme ? `±${task.result.rme.toFixed(2)}%` : 'N/A',
  extra: `${task.result.samples ? task.result.samples.length : 0} samples`
}));

console.log('\n--- Benchmark Results (JSON) ---');
console.log(JSON.stringify(results, null, 2));
