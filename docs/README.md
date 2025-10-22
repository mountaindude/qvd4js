# qvd4js Documentation

Welcome to the qvd4js documentation directory. This folder contains comprehensive guides for developers, contributors, and users of the qvd4js library.

## Available Documentation

### [Testing Summary](./TESTING_SUMMARY.md) ⭐ **Start Here**

**Purpose**: Executive summary and quick reference guide for the multi-platform testing solution.

**Contents**:
- High-level architecture overview
- Quick setup guides for self-hosted runners
- Test coverage breakdown
- Security testing focus areas
- Implementation timeline
- Success metrics and FAQ

**Audience**: Everyone! Start here for a quick understanding before diving into details.

**Reading Time**: 5-10 minutes

### [Multi-Platform Test Solution Design](./MULTI_PLATFORM_TEST_DESIGN.md)

**Purpose**: Comprehensive technical specification for the automated multi-platform testing infrastructure.

**Contents**:
- Detailed test architecture and execution flow with Mermaid diagrams
- Complete test categories (unit, integration, E2E, security, performance)
- Test data requirements and generation strategies
- Platform coverage details (Windows, macOS, Linux)
- Complete GitHub Actions workflow configurations
- Step-by-step self-hosted runner setup and configuration
- In-depth security testing approach
- Implementation phases and success metrics
- Maintenance and evolution strategies

**Audience**: Developers, DevOps engineers, and project maintainers implementing the testing infrastructure.

**Reading Time**: 30-45 minutes

**Key Highlights**:
- 🎯 95%+ test coverage across all platforms
- 🔒 Comprehensive security testing including path traversal prevention
- 📊 Performance benchmarking and tracking
- 🤖 Fully automated CI/CD with GitHub Actions
- 🖥️ Support for self-hosted runners on all major operating systems

## Quick Links

- [Main README](../README.md) - Getting started with qvd4js
- [Contributing Guidelines](../CONTRIBUTING.md) - How to contribute (if available)
- [GitHub Issues](https://github.com/mountaindude/qvd4js/issues) - Bug reports and feature requests

## Documentation Structure

```
docs/
├── README.md                           # This file - documentation index
├── TESTING_SUMMARY.md                  # Executive summary - start here! ⭐
└── MULTI_PLATFORM_TEST_DESIGN.md      # Complete technical specification
```

## For Contributors

If you're contributing to qvd4js, please review:

1. **Multi-Platform Test Design** - Understand the testing infrastructure
2. **Main README** - Learn about the library's API and usage
3. **Existing Tests** in `__tests__/` - See patterns and conventions

## For Users

If you're using qvd4js in your project:

1. Start with the [Main README](../README.md) for installation and basic usage
2. Review the API documentation in the main README
3. Check the `__tests__/` directory for usage examples

## For DevOps/Infrastructure

If you're setting up runners or CI/CD:

1. Read the [Multi-Platform Test Design](./MULTI_PLATFORM_TEST_DESIGN.md)
2. Follow the self-hosted runner setup guides
3. Configure GitHub Actions workflows as documented

## Future Documentation

Planned documentation additions:
- Architecture deep-dive for QVD file format handling
- Performance optimization guide
- Security best practices guide
- Troubleshooting and FAQ

---

**Last Updated**: 2025-10-22  
**Maintained By**: qvd4js Contributors
