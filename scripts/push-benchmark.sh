#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get platform and Node version (or use provided arguments)
PLATFORM="${1:-$(uname -s)}"
NODE_VERSION="${2:-node$(node --version | cut -d'v' -f2 | cut -d'.' -f1).x}"

echo -e "${BLUE}📊 Pushing benchmark for ${PLATFORM}-${NODE_VERSION}${NC}"

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) not found. Please install it first:${NC}"
    echo "   brew install gh  # macOS"
    echo "   Or visit: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with GitHub CLI${NC}"
    echo "   Run: gh auth login"
    exit 1
fi

# Store current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 Current branch: ${CURRENT_BRANCH}${NC}"

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes. They won't be included in the benchmark.${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build the project
echo -e "${BLUE}🔨 Building project...${NC}"
npm run build

# Run benchmarks
echo -e "${BLUE}⚡ Running benchmarks...${NC}"
npm run bench:ci

if [ ! -f benchmark-results.json ]; then
    echo -e "${RED}❌ benchmark-results.json not found. Did the benchmark run successfully?${NC}"
    exit 1
fi

# Store benchmark results in a temporary location
echo -e "${BLUE}💾 Saving benchmark results...${NC}"
cp benchmark-results.json /tmp/qvd4js-benchmark-results.json

# Fetch and checkout gh-pages branch
echo -e "${BLUE}📝 Fetching gh-pages branch...${NC}"
git fetch origin gh-pages 2>/dev/null || {
    echo -e "${YELLOW}⚠️  gh-pages branch doesn't exist. Creating it...${NC}"
    git checkout --orphan gh-pages
    git rm -rf .
    echo "<h1>qvd4js Benchmarks</h1>" > index.html
    git add index.html
    git commit -m "Initial gh-pages commit"
    git push origin gh-pages
    git checkout "${CURRENT_BRANCH}"
    git fetch origin gh-pages
}

git checkout gh-pages

# Restore benchmark results
cp /tmp/qvd4js-benchmark-results.json benchmark-results.json

# Create benchmark directory
BENCHMARK_DIR="benchmarks/${PLATFORM}-${NODE_VERSION}"
echo -e "${BLUE}📁 Creating directory: ${BENCHMARK_DIR}${NC}"
mkdir -p "${BENCHMARK_DIR}"

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx not found. Please ensure Node.js is properly installed.${NC}"
    git checkout "${CURRENT_BRANCH}"
    rm -f /tmp/qvd4js-benchmark-results.json
    exit 1
fi

# Process benchmark data using github-action-benchmark
echo -e "${BLUE}💾 Processing benchmark data...${NC}"

# Use github-action-benchmark to process and store the data
npx -y github-action-benchmark@v1 \
  --tool customBiggerIsBetter \
  --benchmark-data-dir-path "${BENCHMARK_DIR}" \
  --output-file-path benchmark-results.json \
  --github-token "$(gh auth token)" \
  --auto-push \
  --alert-threshold 150 \
  --comment-on-alert true \
  --fail-on-alert false \
  --summary-always true || {
    echo -e "${RED}❌ Failed to process benchmark data${NC}"
    git checkout "${CURRENT_BRANCH}"
    exit 1
}

# Clean up temporary benchmark files
rm -f benchmark-results.json
rm -f /tmp/qvd4js-benchmark-results.json

# Return to original branch
echo -e "${BLUE}✅ Done! Returning to ${CURRENT_BRANCH}...${NC}"
git checkout "${CURRENT_BRANCH}"

# Clean up benchmark-results.json in working directory if it exists
rm -f benchmark-results.json

# Get repository info for URL
REPO_INFO=$(gh repo view --json owner,name -q '"\(.owner.login)/\(.name)"')
OWNER=$(echo $REPO_INFO | cut -d'/' -f1)
REPO=$(echo $REPO_INFO | cut -d'/' -f2)

echo -e "${GREEN}🎉 Benchmark results pushed to gh-pages!${NC}"
echo -e "${GREEN}View at: https://${OWNER}.github.io/${REPO}/${BENCHMARK_DIR}/${NC}"
