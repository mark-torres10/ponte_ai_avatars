# GitHub Actions CI/CD

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### 1. CI - Build Check (`ci.yml`)

**Purpose**: Basic build verification that runs on every commit and pull request.

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**What it does**:
- Installs dependencies for both frontend and backend
- Runs `npm run build` for both projects
- Verifies TypeScript compilation passes
- Ensures both projects can build successfully

**Duration**: ~2-3 minutes

### 2. CI - Comprehensive (`ci-comprehensive.yml`)

**Purpose**: Full CI pipeline with linting, testing, and build verification.

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**What it does**:
- **Frontend Job**:
  - Installs dependencies
  - Runs linting (`npm run lint`)
  - Builds the project (`npm run build`)
- **Backend Job**:
  - Installs dependencies
  - Runs linting (`npm run lint`)
  - Builds the project (`npm run build`)
  - Runs tests (`npm test`)
- **Build Verification Job**:
  - Runs after both frontend and backend jobs complete
  - Verifies both projects build together successfully
  - Creates a build summary

**Duration**: ~4-6 minutes

## Configuration

### Node.js Version
Both workflows use Node.js 20.x for consistency with the project requirements.

### Caching
npm dependencies are cached to speed up builds.

### Matrix Strategy
The basic CI workflow runs on a single Node.js version, while the comprehensive workflow could be extended with matrix testing if needed.

## Local Testing

To test the CI workflows locally before pushing:

```bash
# Test frontend build
npm ci
npm run build

# Test backend build
cd backend
npm ci
npm run build
npm test
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that both `npm run build` commands work locally
2. **Linting Errors**: Run `npm run lint` in both frontend and backend directories
3. **Test Failures**: Ensure all tests pass locally with `npm test`

### Adding New Checks

To add new CI checks:

1. Add the script to the appropriate `package.json`
2. Update the relevant workflow file
3. Test locally before pushing
4. Update this documentation

## Future Enhancements

- Add deployment workflows for staging/production
- Add security scanning
- Add performance testing
- Add dependency vulnerability scanning 