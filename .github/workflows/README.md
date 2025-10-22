# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the qvd4js project.

## Workflows

### `test.yml` - Multi-Platform Test Suite (Production)

The main CI/CD workflow that runs on pushes to `main` and on a weekly schedule.

**Features:**

- Runs linting, building, and testing across multiple platforms and Node.js versions
- Tests on: Linux (GitHub-hosted), Windows, macOS Intel, and macOS ARM (self-hosted)
- Tests with Node.js versions: 20.x, 22.x, 24.x
- Publishes benchmark results to GitHub Pages after ALL test matrix jobs complete
- Runs security scans

**When to use:** This is the production workflow that runs automatically. Don't modify this for debugging.

### `benchmark-debug.yml` - Benchmark Debug (Fast Feedback) ⚡

A lightweight workflow specifically designed for **fast debugging of benchmark GitHub Pages issues**.

**Key differences from production:**

- ✅ **Manual trigger only** - Run when you need it via workflow_dispatch
- ✅ **Single OS/Node combination** - Choose one platform and Node version
- ✅ **Immediate feedback** - Benchmarks are published as soon as the single job completes (not waiting for 12 jobs!)
- ✅ **Separate data directory** - Uses `benchmarks-debug/` to avoid interfering with production data
- ✅ **Job summaries** - Shows benchmark results directly in the GitHub Actions summary

**How to use:**

1. Go to **Actions** tab in GitHub
2. Select **"Benchmark Debug (Fast Feedback)"** workflow
3. Click **"Run workflow"**
4. Choose:
   - Platform: Linux, Windows, macOS-Intel, or macOS-ARM
   - Node.js version: 20.x, 22.x, or 24.x
5. Click **"Run workflow"**
6. Wait ~1-2 minutes (instead of waiting for all 12 matrix jobs to complete!)
7. View results at: `https://ptarmiganlabs.github.io/qvd4js/benchmarks-debug/{platform}-node{version}`

**Example:**

- Select: `Linux` + `20.x`
- Results appear at: `https://ptarmiganlabs.github.io/qvd4js/benchmarks-debug/Linux-node20.x`

**Why this workflow exists:**

The production workflow waits for all 12 OS/Node combinations to complete before publishing ANY benchmarks. This is correct for production (you want complete data), but makes debugging very slow. This debug workflow gives you immediate feedback on a single configuration, dramatically speeding up the debug cycle.

## Debugging Benchmark Issues

If you're seeing issues with benchmark data on GitHub Pages (e.g., only 2 data points per chart):

1. Use the `benchmark-debug.yml` workflow with a single platform
2. Check the Job Summary for the raw benchmark results
3. Visit the debug GitHub Pages URL immediately after the workflow completes
4. Iterate quickly without waiting for 12 jobs each time
5. Once fixed, verify with the full `test.yml` workflow

## Related Documentation

- [GitHub Pages Setup](../docs/GITHUB_PAGES_SETUP.md)
- [Testing Guide](../docs/TESTING.md)
- [Continuous Benchmark Action](https://github.com/marketplace/actions/continuous-benchmark)
