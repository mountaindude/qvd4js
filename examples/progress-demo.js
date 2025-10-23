// Example demonstrating progress callbacks for QVD file writing

import {QvdDataFrame} from '../src/index.js';
import fs from 'fs';

async function demonstrateProgressCallbacks() {
  console.log('='.repeat(70));
  console.log('QVD4JS Progress Callback Demonstration');
  console.log('='.repeat(70));
  console.log();

  // Create a moderately sized dataset
  const numRows = 5000;
  const numCols = 8;

  console.log(`Creating dataset with ${numRows} rows and ${numCols} columns...`);

  const columns = Array.from({length: numCols}, (_, i) => `Column${i + 1}`);
  const data = Array.from({length: numRows}, (_, i) =>
    Array.from({length: numCols}, (_, j) => {
      // Mix of data types to make it realistic
      if (j === 0) return i; // ID column
      if (j === 1) return `Name${i % 100}`; // Low cardinality string
      if (j === 2) return Math.random() * 1000; // Float
      if (j === 3) return i % 2 === 0 ? 'Active' : 'Inactive'; // Binary category
      if (j === 4) return Math.floor(Math.random() * 100); // Integer
      if (j === 5) return `Description ${i}`; // High cardinality string
      if (j === 6) return i % 10 === 0 ? null : `Value${i % 50}`; // With nulls
      return Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : null; // Mixed with nulls
    }),
  );

  const df = await QvdDataFrame.fromDict({columns, data});
  console.log(`✓ Dataset created: ${df.shape[0]} rows × ${df.shape[1]} columns`);
  console.log();

  const outputPath = '__tests__/data/demo-progress.qvd';

  console.log('Writing QVD file with progress tracking...');
  console.log('-'.repeat(70));

  const startTime = Date.now();
  let lastStage = '';

  await df.toQvd(outputPath, {
    onProgress: (progress) => {
      // Print a new header when stage changes
      if (progress.stage !== lastStage) {
        console.log();
        const stageName = progress.stage
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        console.log(`[${stageName}]`);
        lastStage = progress.stage;
      }

      // Create progress bar
      const barWidth = 40;
      const filledWidth = Math.floor((progress.percent / 100) * barWidth);
      const emptyWidth = barWidth - filledWidth;
      const bar = '█'.repeat(filledWidth) + '░'.repeat(emptyWidth);

      // Format the progress line
      const progressLine = `  ${bar} ${progress.percent}% (${progress.current}/${progress.total})`;
      process.stdout.write('\r' + progressLine);

      // Add newline when stage completes
      if (progress.current === progress.total) {
        console.log(' ✓');
      }
    },
  });

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log();
  console.log('-'.repeat(70));
  console.log(`✓ QVD file written successfully in ${duration} seconds`);

  // Verify the file
  const stats = fs.statSync(outputPath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`  File size: ${sizeInMB} MB`);
  console.log(`  Path: ${outputPath}`);
  console.log();

  // Clean up
  fs.unlinkSync(outputPath);
  console.log('✓ Demo completed successfully');
  console.log('='.repeat(70));
}

// Run the demonstration
demonstrateProgressCallbacks().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
