# Scripts

Utility scripts for the qvd4js project.

## push-benchmark.sh

Automates pushing benchmark results to GitHub Pages.

### Usage

```bash
# Using npm script (recommended)
npm run bench:push

# Or directly
./scripts/push-benchmark.sh

# With custom platform and Node version
./scripts/push-benchmark.sh "macOS-ARM" "node22.x"
```

### Prerequisites

- GitHub CLI installed and authenticated (`gh auth login`)
- Node.js and npm installed
- Write access to the repository

### What it does

1. Validates GitHub CLI authentication
2. Builds the project
3. Runs benchmarks
4. Switches to `gh-pages` branch (creates if needed)
5. Processes results using `github-action-benchmark`
6. Pushes to GitHub Pages
7. Returns to your original branch
8. Displays the results URL

### Examples

```bash
# Run on your current platform with current Node version
npm run bench:push

# Run for specific configurations
./scripts/push-benchmark.sh "Linux" "node20.x"
./scripts/push-benchmark.sh "Windows" "node24.x"
./scripts/push-benchmark.sh "macOS-Intel" "node22.x"
```

### Troubleshooting

**Error: GitHub CLI (gh) not found**

```bash
# macOS
brew install gh

# Or visit: https://cli.github.com/
```

**Error: Not authenticated with GitHub CLI**

```bash
gh auth login
```

**Error: Permission denied**

Ensure you have write access to the repository and the `gh-pages` branch doesn't have strict protection rules.
