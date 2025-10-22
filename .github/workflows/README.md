# GitHub Actions Workflows

This directory contains the GitHub Actions workflows for automated testing of the qvd4js library.

## Workflows

### 1. Multi-Platform Test Suite (`test.yml`)

**Purpose**: Automated testing across multiple platforms using GitHub-hosted runners.

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Weekly schedule (Sundays at midnight UTC)

**Jobs**:

1. **Lint** - Code quality checks using ESLint
2. **Build** - Build the project and upload artifacts
3. **Test** - Run tests on a matrix of platforms and Node.js versions:
   - Platforms: Ubuntu 22.04, Windows Server 2022, macOS 13
   - Node.js: 20.x, 22.x
   - Total: 6 configurations
4. **Security Scan** - Run npm audit and Snyk security scans
5. **Performance** - Run performance benchmarks
6. **Summary** - Generate test summary

**Coverage**: Results are uploaded to Codecov with flags per platform/Node version.

**Artifacts**: Test results and coverage reports are retained for 30 days.

### 2. Self-Hosted Multi-Platform Tests (`test-self-hosted.yml`)

**Purpose**: Testing on actual self-hosted runners with specific OS environments.

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch (with optional Node.js version selection)

**Runner Labels**:

The workflow uses placeholder labels that should be configured on your self-hosted runners:

| Platform | Labels | Description |
|----------|--------|-------------|
| Linux | `[self-hosted, linux, x64]` | Linux x64 runner |
| Windows | `[self-hosted, windows, x64]` | Windows x64 runner |
| macOS Intel | `[self-hosted, macos, x64]` | macOS Intel runner |
| macOS ARM | `[self-hosted, macos, arm64]` | macOS Apple Silicon runner |

**Configuration**:

To use these workflows with your self-hosted runners:

1. Set up GitHub Actions runners on your machines
2. Configure runner labels to match the placeholders:
   ```bash
   # Example for Linux
   ./config.sh --url https://github.com/mountaindude/qvd4js \
                --token <TOKEN> \
                --labels self-hosted,linux,x64
   
   # Example for Windows
   ./config.cmd --url https://github.com/mountaindude/qvd4js ^
                --token <TOKEN> ^
                --labels self-hosted,windows,x64
   
   # Example for macOS Intel
   ./config.sh --url https://github.com/mountaindude/qvd4js \
                --token <TOKEN> \
                --labels self-hosted,macos,x64
   
   # Example for macOS Apple Silicon
   ./config.sh --url https://github.com/mountaindude/qvd4js \
                --token <TOKEN> \
                --labels self-hosted,macos,arm64
   ```

3. Ensure runners have Node.js 20.x and 22.x available

**Jobs**:

1. **test-self-hosted** - Run tests on each self-hosted platform with Node.js 20.x and 22.x
   - 8 total configurations (4 platforms × 2 Node versions)
   - Displays system information
   - Runs full test suite with coverage
   - Uploads results per platform

2. **cross-platform-verification** - Verifies results across all platforms
   - Downloads all artifacts
   - Generates cross-platform summary
   - Uploads combined results (retained for 90 days)

## Environment Variables and Secrets

The following secrets should be configured in your GitHub repository:

| Secret | Required | Purpose |
|--------|----------|---------|
| `CODECOV_TOKEN` | Optional | Upload coverage to Codecov |
| `SNYK_TOKEN` | Optional | Run Snyk security scans |

To add secrets:
1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add the required secrets

## Workflow Customization

### Changing Node.js Versions

To test with different Node.js versions, update the matrix in both workflows:

```yaml
# In test.yml
matrix:
  node: ['20.x', '22.x', '24.x']  # Add or remove versions

# In test-self-hosted.yml
matrix:
  include:
    - platform: Linux
      runner-label: [self-hosted, linux, x64]
      node: '24.x'  # Add new version
```

### Changing Platforms

To add or remove platforms:

```yaml
# In test.yml - GitHub-hosted runners
matrix:
  os:
    - ubuntu-22.04
    - ubuntu-24.04  # Add new platform
    - windows-2022
    - macos-13
    - macos-14      # Add new platform

# In test-self-hosted.yml - Self-hosted runners
matrix:
  include:
    - platform: Linux-ARM
      runner-label: [self-hosted, linux, arm64]  # Add new platform
      node: '20.x'
```

### Changing Test Commands

The workflows currently run:
- `npm run lint` - Linting
- `npm run build` - Building
- `npm test` - All tests with coverage

To add specialized test commands (as designed in MULTI_PLATFORM_TEST_DESIGN.md):

1. Add scripts to `package.json`:
   ```json
   {
     "scripts": {
       "test:unit": "jest __tests__/*.test.js --coverage",
       "test:integration": "jest __tests__/integration/*.test.js",
       "test:e2e": "jest __tests__/e2e/*.test.js",
       "test:security": "jest __tests__/security/*.test.js",
       "test:performance": "jest __tests__/performance/*.test.js"
     }
   }
   ```

2. Update workflow steps:
   ```yaml
   - name: Run unit tests
     run: npm run test:unit
   
   - name: Run integration tests
     run: npm run test:integration
   
   - name: Run E2E tests
     run: npm run test:e2e
   
   - name: Run security tests
     run: npm run test:security
   ```

## Monitoring and Debugging

### View Workflow Runs

1. Go to the "Actions" tab in your GitHub repository
2. Select the workflow you want to view
3. Click on a specific run to see details

### Download Artifacts

Artifacts (test results, coverage) can be downloaded from workflow run pages:

1. Open a workflow run
2. Scroll to the "Artifacts" section at the bottom
3. Click on the artifact name to download

### Workflow Status Badges

Add status badges to your README.md:

```markdown
[![Multi-Platform Tests](https://github.com/mountaindude/qvd4js/actions/workflows/test.yml/badge.svg)](https://github.com/mountaindude/qvd4js/actions/workflows/test.yml)

[![Self-Hosted Tests](https://github.com/mountaindude/qvd4js/actions/workflows/test-self-hosted.yml/badge.svg)](https://github.com/mountaindude/qvd4js/actions/workflows/test-self-hosted.yml)
```

## Troubleshooting

### Common Issues

**Issue**: Tests fail on specific platform
- Check platform-specific logs in the workflow run
- Verify Node.js version compatibility
- Check for platform-specific path issues (Windows vs Unix)

**Issue**: Self-hosted runner not picking up jobs
- Verify runner is online: Settings → Actions → Runners
- Check runner labels match workflow configuration
- Ensure runner has required software installed (Node.js, npm)

**Issue**: Coverage upload fails
- Verify `CODECOV_TOKEN` is set correctly
- Check Codecov service status
- Review codecov action logs for errors

**Issue**: Artifacts not uploading
- Check artifact retention settings
- Verify artifact paths exist
- Ensure upload-artifact action version is compatible

### Getting Help

For more information:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Self-Hosted Runners Setup](https://docs.github.com/en/actions/hosting-your-own-runners)
- [Multi-Platform Test Design Document](../docs/MULTI_PLATFORM_TEST_DESIGN.md)

## Maintenance

### Regular Tasks

- **Weekly**: Review workflow run success rates
- **Monthly**: Update action versions to latest
- **Quarterly**: Review and optimize test execution times
- **As needed**: Add new platforms or Node.js versions

### Updating Actions

When updating action versions (e.g., `actions/checkout@v4` to `actions/checkout@v5`):

1. Check action changelog for breaking changes
2. Update all occurrences in both workflow files
3. Test on a feature branch first
4. Monitor first few runs after update

## Future Enhancements

Based on the [MULTI_PLATFORM_TEST_DESIGN.md](../docs/MULTI_PLATFORM_TEST_DESIGN.md), planned enhancements include:

- [ ] Separate test jobs for integration, E2E, security, and performance tests
- [ ] Performance regression tracking with historical data
- [ ] Cross-platform file compatibility tests
- [ ] Expanded test data with additional QVD files
- [ ] Security scanning with multiple tools
- [ ] Test result trending and analytics

---

**Last Updated**: 2025-10-22  
**Maintained By**: qvd4js Contributors
