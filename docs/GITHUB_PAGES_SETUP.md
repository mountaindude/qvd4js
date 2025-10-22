# GitHub Pages Setup for Benchmark Results

This guide explains how to set up GitHub Pages to display and track benchmark results over time for the qvd4js project.

## Overview

The project includes a benchmark suite (`benchmarks/qvd-parsing.bench.js`) that measures parsing performance across different QVD file sizes and loading strategies. These benchmarks can be automatically tracked and visualized using GitHub Pages and the `github-action-benchmark` action.

## Prerequisites

- Repository with admin or maintainer access
- GitHub Actions enabled in the repository
- Benchmark script that outputs results in a compatible format

## Step 1: Enable GitHub Pages

By default, GitHub Pages may be disabled in a repository. Follow these steps to enable it:

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub
   - Click on **Settings** tab (you need admin access)

2. **Access Pages Settings**
   - In the left sidebar, scroll down to **Code and automation** section
   - Click on **Pages**

3. **Configure Source Branch**
   - Under **Build and deployment**, find the **Source** section
   - Select **Deploy from a branch** from the dropdown
   - Choose the branch to deploy from (typically `gh-pages`)
   - Select the folder: `/ (root)` or `/docs` depending on your setup
   - Click **Save**

4. **Wait for Deployment**
   - GitHub will automatically deploy your site
   - You'll see a message: "Your site is live at https://[username].github.io/[repository]/"
   - Initial deployment may take a few minutes

## Step 2: Create the `gh-pages` Branch

The benchmark results will be stored in a separate `gh-pages` branch to keep them isolated from your main codebase.

### Option A: Create via GitHub UI

1. Go to your repository on GitHub
2. Click on the branch dropdown (usually showing "main")
3. Type `gh-pages` in the text field
4. Click "Create branch: gh-pages from main"

### Option B: Create via Command Line

```bash
# Create an orphan branch (no history from main)
git checkout --orphan gh-pages

# Remove all files
git rm -rf .

# Create an initial index.html
echo "<h1>Benchmark Results</h1>" > index.html

# Commit and push
git add index.html
git commit -m "Initial gh-pages commit"
git push origin gh-pages

# Switch back to your working branch
git checkout main
```

## Step 3: Update GitHub Actions Workflow

Add benchmark steps to your existing test matrix job in `.github/workflows/test.yml` to run benchmarks for each platform and Node.js version combination.

### Matrix-Based Benchmark Tracking

The recommended approach is to integrate benchmarks into your existing test matrix so that performance is tracked separately for each platform/Node.js version combination:

```yaml
test:
  name: Test - ${{ matrix.platform }} - Node ${{ matrix.node }}
  needs: build
  runs-on: ${{ matrix.runner }}
  permissions:
    contents: write # Required to push to gh-pages
    deployments: write # Required for GitHub Pages deployment
  strategy:
    fail-fast: false
    matrix:
      include:
        - platform: Linux
          runner: ubuntu-22.04
          node: '20.x'
        - platform: Linux
          runner: ubuntu-22.04
          node: '22.x'
        - platform: Windows
          runner: [self-hosted, windows, x64]
          node: '20.x'
        # ... other matrix combinations
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build project
      run: npm run build

    - name: Run tests with coverage
      run: npm test

    # ... other test steps ...

    - name: Run benchmarks
      if: github.ref == 'refs/heads/main' && github.event_name == 'push'
      run: npm run bench:ci

    - name: Store benchmark results to GitHub Pages
      if: github.ref == 'refs/heads/main' && github.event_name == 'push'
      uses: benchmark-action/github-action-benchmark@v1
      with:
        tool: 'customBiggerIsBetter' # For ops/sec, higher is better
        output-file-path: benchmark-results.json
        github-token: ${{ secrets.GITHUB_TOKEN }}
        auto-push: true
        alert-threshold: '150%'
        comment-on-alert: true
        fail-on-alert: false
        summary-always: true
        gh-pages-branch: gh-pages
        # Each platform/node combination gets its own directory
        benchmark-data-dir-path: 'benchmarks/${{ matrix.platform }}-node${{ matrix.node }}'
```

**Key Features:**

- ✅ Benchmarks run for **every platform and Node.js version** in your test matrix
- ✅ Results are stored in **separate directories** per configuration
- ✅ Only runs on `main` branch pushes (not on PRs or other branches)
- ✅ Each configuration has its own performance trend line
- ✅ Allows comparison of performance across different environments

### Alternative: Single Benchmark Job (Not Recommended)

If you prefer to run benchmarks only on a single platform (e.g., Ubuntu with Node 20.x), you can create a separate job:

```yaml
benchmark:
  name: Run Benchmarks
  runs-on: ubuntu-22.04
  if: github.ref == 'refs/heads/main' # Only run on main branch
  needs: build
  permissions:
    contents: write # Required to push to gh-pages
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build project
      run: npm run build

    - name: Run benchmarks
      run: npm run bench > benchmark-output.txt

    - name: Store benchmark result
      uses: benchmark-action/github-action-benchmark@v1
      with:
        # What benchmark tool the output is formatted as
        tool: 'customSmallerIsBetter'
        # Where the output from the benchmark tool is stored
        output-file-path: benchmark-output.txt
        # GitHub API token to make commit to gh-pages branch
        github-token: ${{ secrets.GITHUB_TOKEN }}
        # Enable auto-push to gh-pages
        auto-push: true
        # Show alert with commit comment on detecting possible performance regression
        alert-threshold: '200%'
        # Comment on commit with performance results
        comment-on-alert: true
        # Fail the workflow if alert threshold is exceeded
        fail-on-alert: false
        # Enable Job Summary
        summary-always: true
```

### Alternative: Using a Separate Benchmark Workflow

Create `.github/workflows/benchmark.yml`:

```yaml
name: Performance Benchmarks

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  benchmark:
    name: Run Performance Benchmarks
    runs-on: ubuntu-22.04
    permissions:
      contents: write
      deployments: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Run benchmarks
        run: npm run bench:ci

      - name: Download previous benchmark data
        uses: actions/cache@v4
        with:
          path: ./cache
          key: ${{ runner.os }}-benchmark

      - name: Store benchmark result
        uses: benchmark-action/github-action-benchmark@v1
        with:
          tool: 'customSmallerIsBetter'
          output-file-path: benchmark-results.json
          github-token: ${{ secrets.GITHUB_TOKEN }}
          auto-push: true
          alert-threshold: '150%'
          comment-on-alert: true
          fail-on-alert: false
          summary-always: true
          # Benchmark data will be stored in gh-pages branch
          gh-pages-branch: gh-pages
          benchmark-data-dir-path: benchmarks
```

## Step 4: Configure Benchmark Output Format

Ensure your benchmark script outputs data in a format compatible with `github-action-benchmark`. The current script outputs:

```javascript
const results = bench.tasks.map((task) => ({
  name: task.name,
  unit: 'ops/sec',
  value: task.result.hz || 0,
  range: task.result.rme ? `±${task.result.rme.toFixed(2)}%` : 'N/A',
  extra: `${task.result.samples ? task.result.samples.length : 0} samples`,
}));
```

This is compatible with the `customSmallerIsBetter` or `customBiggerIsBetter` tool setting (use `customBiggerIsBetter` for ops/sec since higher is better).

### Update the Workflow Configuration

Modify the `with.tool` parameter to:

```yaml
tool: 'customBiggerIsBetter' # For ops/sec, higher is better
```

## Step 5: Grant Necessary Permissions

### Workflow Permissions

Ensure your workflow has the necessary permissions to push to the `gh-pages` branch:

1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### Alternative: Use Fine-Grained Permissions

If you prefer more control, use the `permissions` block in your workflow:

```yaml
permissions:
  contents: write
  deployments: write
```

## Step 6: Verify Setup

1. **Push a Commit to Main Branch**

   ```bash
   git add .
   git commit -m "Add benchmark tracking"
   git push origin main
   ```

2. **Check GitHub Actions**
   - Navigate to the **Actions** tab in your repository
   - Verify the benchmark job runs successfully
   - Check for any errors in the workflow logs

3. **Verify GitHub Pages Deployment**
   - Go to **Settings** → **Pages**
   - You should see: "Your site is live at https://[username].github.io/[repository]/"
   - Click the link to view your benchmark results

4. **Check the gh-pages Branch**
   ```bash
   git fetch origin
   git checkout gh-pages
   git log  # Verify commits from the GitHub Actions bot
   ```

## Accessing Benchmark Results

Once set up, benchmark results will be available at multiple URLs, one for each platform/Node.js combination:

```
https://[username].github.io/[repository]/benchmarks/[Platform]-node[Version]/
```

For example:

- `https://ptarmiganlabs.github.io/qvd4js/benchmarks/Linux-node20.x/`
- `https://ptarmiganlabs.github.io/qvd4js/benchmarks/Windows-node22.x/`
- `https://ptarmiganlabs.github.io/qvd4js/benchmarks/macOS-ARM-node24.x/`

Each page will display:

- Historical benchmark trends (line charts) for that specific configuration
- Performance comparisons over time
- Alerts for performance regressions
- Raw benchmark data

### Creating a Landing Page

You may want to create an index page that links to all your benchmark configurations. Create an `index.html` file in the `gh-pages` branch root:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>qvd4js Benchmarks</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 900px;
        margin: 50px auto;
        padding: 20px;
      }
      h1 {
        color: #333;
      }
      h2 {
        color: #555;
        margin-top: 30px;
      }
      a {
        color: #0366d6;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .platform-group {
        margin-bottom: 20px;
      }
      ul {
        list-style-type: none;
        padding-left: 0;
      }
      li {
        padding: 5px 0;
      }
    </style>
  </head>
  <body>
    <h1>qvd4js Performance Benchmarks</h1>
    <p>Performance tracking across different platforms and Node.js versions.</p>

    <div class="platform-group">
      <h2>Linux</h2>
      <ul>
        <li>📊 <a href="./benchmarks/Linux-node20.x/">Node.js 20.x</a></li>
        <li>📊 <a href="./benchmarks/Linux-node22.x/">Node.js 22.x</a></li>
        <li>📊 <a href="./benchmarks/Linux-node24.x/">Node.js 24.x</a></li>
      </ul>
    </div>

    <div class="platform-group">
      <h2>Windows</h2>
      <ul>
        <li>📊 <a href="./benchmarks/Windows-node20.x/">Node.js 20.x</a></li>
        <li>📊 <a href="./benchmarks/Windows-node22.x/">Node.js 22.x</a></li>
        <li>📊 <a href="./benchmarks/Windows-node24.x/">Node.js 24.x</a></li>
      </ul>
    </div>

    <div class="platform-group">
      <h2>macOS Intel</h2>
      <ul>
        <li>📊 <a href="./benchmarks/macOS-Intel-node20.x/">Node.js 20.x</a></li>
        <li>📊 <a href="./benchmarks/macOS-Intel-node22.x/">Node.js 22.x</a></li>
        <li>📊 <a href="./benchmarks/macOS-Intel-node24.x/">Node.js 24.x</a></li>
      </ul>
    </div>

    <div class="platform-group">
      <h2>macOS Apple Silicon</h2>
      <ul>
        <li>📊 <a href="./benchmarks/macOS-ARM-node20.x/">Node.js 20.x</a></li>
        <li>📊 <a href="./benchmarks/macOS-ARM-node22.x/">Node.js 22.x</a></li>
        <li>📊 <a href="./benchmarks/macOS-ARM-node24.x/">Node.js 24.x</a></li>
      </ul>
    </div>

    <p style="margin-top: 40px;">
      <a href="https://github.com/ptarmiganlabs/qvd4js">View Repository on GitHub</a>
    </p>
  </body>
</html>
```

## Troubleshooting

### GitHub Pages Not Deploying

**Issue**: Changes pushed to `gh-pages` branch but site not updating

**Solutions**:

1. Verify Pages is enabled in Settings → Pages
2. Check that the correct branch and folder are selected
3. Wait a few minutes for deployment to complete
4. Check the **Actions** tab for Pages deployment errors

### Workflow Permission Errors

**Issue**: `Error: Resource not accessible by integration`

**Solutions**:

1. Enable write permissions: Settings → Actions → General → Workflow permissions
2. Add explicit permissions to workflow file:
   ```yaml
   permissions:
     contents: write
   ```

### Benchmark Data Not Appearing

**Issue**: Workflow succeeds but no benchmark data visible

**Solutions**:

1. Verify the benchmark output format matches the `tool` parameter
2. Check that `auto-push: true` is set in the workflow
3. Manually check the `gh-pages` branch for the benchmark data
4. Review workflow logs for any errors in the benchmark step

### Access Denied When Creating gh-pages Branch

**Issue**: Cannot push to `gh-pages` branch

**Solutions**:

1. Ensure you have write access to the repository
2. Check branch protection rules: Settings → Branches
3. Verify GitHub token has appropriate permissions

## Advanced Configuration

### Custom Landing Page

Create a custom `index.html` in the `gh-pages` branch to provide a better user experience:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>qvd4js Benchmarks</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 50px auto;
      }
      h1 {
        color: #333;
      }
      a {
        color: #0366d6;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <h1>qvd4js Performance Benchmarks</h1>
    <p>Welcome to the qvd4js performance tracking dashboard.</p>
    <ul>
      <li><a href="./benchmarks/">View Benchmark History</a></li>
      <li><a href="https://github.com/ptarmiganlabs/qvd4js">View Repository</a></li>
    </ul>
  </body>
</html>
```

### Benchmark on Pull Requests

To run benchmarks on PRs without pushing to `gh-pages`:

```yaml
benchmark-pr:
  name: Benchmark PR
  runs-on: ubuntu-22.04
  if: github.event_name == 'pull_request'
  steps:
    # ... checkout and setup steps ...

    - name: Run benchmarks
      run: npm run bench:ci

    - name: Comment benchmark results
      uses: benchmark-action/github-action-benchmark@v1
      with:
        tool: 'customBiggerIsBetter'
        output-file-path: benchmark-results.json
        github-token: ${{ secrets.GITHUB_TOKEN }}
        auto-push: false
        comment-always: true
```

## Manual Benchmark Submission from Command Line

While GitHub Actions automatically handles benchmark submissions, you can also manually run benchmarks and push results to GitHub Pages from your local command line. This is useful for:

- Testing the benchmark workflow locally before pushing
- Creating baseline benchmarks for specific configurations
- Debugging benchmark issues

### Automated Method (Recommended)

The project includes a script that automates the entire process. Simply run:

```bash
npm run bench:push
```

Or with custom platform/Node version:

```bash
./scripts/push-benchmark.sh "macOS-ARM" "node20.x"
```

**What it does:**

1. ✅ Checks for GitHub CLI authentication
2. ✅ Builds the project
3. ✅ Runs benchmarks and generates results
4. ✅ Switches to `gh-pages` branch (creates if needed)
5. ✅ Processes results with `github-action-benchmark`
6. ✅ Pushes to GitHub Pages
7. ✅ Returns to your original branch
8. ✅ Displays the URL where results can be viewed

**Prerequisites:**

- GitHub CLI installed and authenticated: `gh auth login`
- Node.js and npm installed
- Write access to the repository

### Manual Method (For Reference)

If you need to do this manually or customize the process:

```bash
# 1. Build the project
npm run build

# 2. Run benchmarks and save results
npm run bench:ci

# 3. Checkout gh-pages branch
git fetch origin gh-pages
git checkout gh-pages

# 4. Create the benchmark directory structure (if it doesn't exist)
mkdir -p benchmarks/$(uname -s)-node$(node --version | cut -d'v' -f2 | cut -d'.' -f1).x

# 5. Use the github-action-benchmark tool to process and store results
npx github-action-benchmark \
  --tool customBiggerIsBetter \
  --benchmark-data-dir-path "benchmarks/$(uname -s)-node$(node --version | cut -d'v' -f2 | cut -d'.' -f1).x" \
  --output-file-path ../benchmark-results.json \
  --github-token "$(gh auth token)" \
  --auto-push

# 6. Return to your working branch
git checkout -
```

### Script Details

The `scripts/push-benchmark.sh` script handles all the complexity:

- Validates GitHub CLI is installed and authenticated
- Checks for uncommitted changes (warns but allows continuing)
- Builds the project and runs benchmarks
- Auto-creates `gh-pages` branch if it doesn't exist
- Uses the same `github-action-benchmark` tool as CI
- Automatically detects platform and Node version
- Returns to your original branch when done
- Displays the URL where results can be viewed

### Important Notes

- **Benchmark consistency**: Manual benchmarks from your local machine may show different performance characteristics than CI runners due to:
  - Different hardware
  - Background processes
  - System load
  - Environmental differences

- **Branch protection**: If the `gh-pages` branch has protection rules, you may need to temporarily disable them or use a different approach.

- **Data format**: Ensure your `benchmark-results.json` follows the format expected by `github-action-benchmark`:

  ```json
  [
    {
      "name": "Parse small QVD (~600 rows)",
      "unit": "ops/sec",
      "value": 123.45,
      "range": "±2.5%",
      "extra": "100 samples"
    }
  ]
  ```

- **Historical data**: The github-action-benchmark tool automatically maintains historical data. Manual commits should preserve the existing `data.js` file in the benchmark directory.

## Security Considerations

- The `GITHUB_TOKEN` is automatically provided by GitHub Actions
- No additional secrets configuration required for basic setup
- For private repositories, GitHub Pages may require a paid plan
- Review branch protection rules to prevent unauthorized changes to `gh-pages`
- Keep your Personal Access Token secure and never commit it to the repository

## Maintenance

- Benchmark data accumulates over time in the `gh-pages` branch
- Consider periodically archiving old benchmark data
- Monitor the size of the `gh-pages` branch
- Update the benchmark suite as the codebase evolves

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [github-action-benchmark](https://github.com/benchmark-action/github-action-benchmark)
- [GitHub Actions Permissions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [Tinybench Documentation](https://github.com/tinylibs/tinybench)
