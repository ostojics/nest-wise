# Integration Tests

This directory contains integration tests for the NestWise Core API using Jest and Testcontainers.

## Overview

The integration tests validate critical infrastructure and end-to-end service functionality using real PostgreSQL and Redis instances. The tests are hermetic and reproducible, with containers provisioned automatically for each test run.

## Architecture

- **Jest Configuration**: `jest.integration.config.ts`
- **Global Setup**: Starts PostgreSQL 15 and Redis 7 containers via Testcontainers
- **Global Teardown**: Stops all containers after tests complete
- **Test Isolation**: Data is cleaned between test runs, fresh containers for each session

## Test Suites

### Connectivity Tests (`connectivity.spec.ts`)

- Database connection validation
- Simple SQL query execution
- Migration verification (checks that all expected tables exist)
- Redis connection and PING test
- Key-value operations validation

### Household Integration Tests (`households.integration.spec.ts`)

- End-to-end CRUD operations for households
- Service and repository layer integration
- Database persistence validation
- License dependency handling
- Error handling (NotFoundException scenarios)

## Running Tests

```bash
# Run integration tests
pnpm test:integration

# Run in watch mode for development
pnpm test:integration:watch

# Run in CI mode (sequential execution)
pnpm test:integration:ci
```

## Container Configuration

- **PostgreSQL**: Version 15, database `nestwise_test`, user `test_user`
- **Redis**: Version 7-alpine, no authentication
- **Migrations**: Automatically applied during NestJS app initialization
- **Environment**: Isolated test environment with required API keys

## Test Environment Variables

The global setup automatically configures:

- `NODE_ENV=test`
- Database connection details (host, port, credentials)
- Redis connection details
- Required API keys (`RESEND_API_KEY`, `JWT_SECRET`)

## Development Notes

- Tests run with a 60-second timeout to accommodate container startup
- Tests execute sequentially (`maxWorkers: 1`) to prevent database migration race conditions
- Containers are automatically cleaned up even if tests fail
- TypeScript path mapping is configured for `src/` imports
- Test coverage excludes spec files and focuses on source code

### Database Race Condition Prevention

The integration tests are configured to run sequentially to avoid PostgreSQL constraint violations that can occur when multiple test suites attempt to run database migrations simultaneously. This ensures clean test execution without spurious database errors.

## CI/CD Integration

The tests are designed to run in CI environments:

- Docker must be available in the CI environment
- Use `pnpm test:integration:ci` for sequential test execution
- Tests are deterministic and don't rely on external services
