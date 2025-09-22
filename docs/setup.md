# Local Development Setup

This guide provides complete instructions for setting up a local development environment for NestWise.

## Prerequisites

### Required Software

- **Node.js**: v22.12.0 or higher (see `.nvmrc` file)
  - Current environment uses Node v20.19.5 which shows warnings but works
- **pnpm**: v10.11.1 (package manager)
- **Docker**: For running PostgreSQL, Redis, and management tools
- **Docker Compose**: For orchestrating development services

### Install pnpm

```bash
npm install -g pnpm@10.11.1
```

## Initial Setup

### 1. Install Dependencies

Install all monorepo dependencies (this may take up to 3 minutes):

```bash
pnpm install
```

**Important**: Do not cancel this operation; allow up to 3 minutes for completion.

### 2. Start External Services

Start PostgreSQL, Redis, and management tools using Docker:

```bash
docker compose up -d
```

This starts the following services:

- **PostgreSQL**: localhost:5432 (user: root, password: root, db: nestwise_dev)
- **Redis**: localhost:6379
- **PgAdmin**: http://localhost:5050 (admin@admin.com / admin)
- **RedisInsight**: http://localhost:5540

### 3. Environment Configuration

#### Backend Environment

Copy the example environment file:

```bash
cp apps/core-api/.env.example apps/core-api/.env
```

**Critical**: Update the `RESEND_API_KEY` in `apps/core-api/.env`:

```bash
RESEND_API_KEY=dummy-key-for-dev
```

The complete `.env` file should contain:

```env
# Application
NODE_ENV=development
APP_PORT=8080
APP_URL=http://localhost:8080
WEB_APP_URL=http://localhost:5173
JWT_SECRET=dev-secret

# External APIs (set dummy key for dev)
OPENAI_API_KEY=
RESEND_API_KEY=dummy-key-for-dev

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=nestwise_dev

# Queues (Redis)
REDIS_HOST=localhost
REDIS_PORT=6379

# Throttling
THROTTLER_ENABLED=false
THROTTLER_TTL=60000
THROTTLER_LIMIT=100
```

#### Frontend Environment

Copy the frontend environment file:

```bash
cp apps/web/.env.example apps/web/.env
```

The frontend `.env` should contain:

```env
VITE_API_URL=http://localhost:8080
```

## Running the Application

### Option 1: Individual Commands (Recommended)

Start each service individually for better control and debugging:

#### Start Backend API

```bash
pnpm --filter @nest-wise/core-api start:debug
```

- **URL**: http://localhost:8080
- **Swagger Documentation**: http://localhost:8080/swagger
- **Startup Time**: 5-10 seconds

#### Start Frontend

```bash
pnpm --filter @nest-wise/web dev
```

- **URL**: http://localhost:5173
- **Startup Time**: 5-10 seconds after dependencies are built

#### Start Contracts in Watch Mode (Optional)

For development with shared type changes:

```bash
pnpm --filter @nest-wise/contracts dev
```

### Option 2: All Services (May Fail)

```bash
make dev
```

**Warning**: This command may fail due to pino-pretty certificate issues. Use individual commands instead if you encounter errors.

## Development Workflow

### Build and Validation Commands

#### Build All Packages

```bash
pnpm build
```

- **Duration**: ~50 seconds
- **Builds**: @nest-wise/contracts, @nest-wise/core-api, @nest-wise/web
- **Timeout**: Set to 2+ minutes, do not cancel early

#### Lint All Code

```bash
pnpm lint
```

- **Duration**: ~32 seconds
- **Timeout**: Set to 1+ minute, do not cancel early
- **Note**: Currently shows warnings but does not block development

### Individual Package Commands

#### Backend (core-api)

```bash
pnpm --filter @nest-wise/core-api <command>
```

Available commands:

- `build`: Compile TypeScript
- `start:debug`: Start with debug logging
- `dev`: Development mode (may fail due to pino-pretty issues)
- `test`: Run unit tests (currently failing due to path resolution)
- `test:e2e`: Run end-to-end tests
- `lint`: ESLint checking

#### Frontend (web)

```bash
pnpm --filter @nest-wise/web <command>
```

Available commands:

- `build`: Build for production
- `dev`: Development server
- `lint`: ESLint checking
- `preview`: Preview production build

#### Contracts (shared types)

```bash
pnpm --filter @nest-wise/contracts <command>
```

Available commands:

- `build`: Compile TypeScript with CJS/ESM outputs
- `dev`: Watch mode for development
- `lint`: ESLint checking

## Validation and Testing

### Manual Testing Requirements

Always validate functionality after making changes:

#### 1. API Health Check

```bash
curl http://localhost:8080/
```

**Expected Response**: `"Hello World!"`

#### 2. Web App Loading

```bash
curl http://localhost:5173/
```

**Expected Response**: HTML containing "NestWise" title

#### 3. Swagger Documentation

```bash
curl http://localhost:8080/swagger
```

**Expected Response**: Swagger UI HTML

### Pre-commit Validation

Always run these commands before committing changes:

```bash
pnpm lint    # ~32 seconds
pnpm build   # ~50 seconds
```

Both commands must pass for the CI pipeline to succeed.

### Known Testing Issues

**Unit Tests Currently Fail**: Due to path resolution issues, unit tests return exit code 1 with module resolution errors. Do not rely on unit tests for validation; use manual testing instead.

```bash
# This will fail but is not your responsibility to fix
pnpm --filter @nest-wise/core-api test
```

E2E tests exist but are not validated in this setup.

## Development Services and Tools

### Database Management

#### PostgreSQL Direct Access

```bash
# Connect to database
psql -h localhost -p 5432 -U root -d nestwise_dev
```

#### PgAdmin Web Interface

- **URL**: http://localhost:5050
- **Email**: admin@admin.com
- **Password**: admin

Add server connection:

- **Host**: postgres (Docker service name) or host.docker.internal
- **Port**: 5432
- **Username**: root
- **Password**: root
- **Database**: nestwise_dev

### Cache and Queue Management

#### Redis Direct Access

```bash
# Connect to Redis CLI
redis-cli -h localhost -p 6379
```

#### RedisInsight Web Interface

- **URL**: http://localhost:5540
- **Host**: localhost:6379

### API Documentation

#### Swagger/OpenAPI

- **URL**: http://localhost:8080/swagger
- **Features**: Interactive API documentation with request/response examples
- **Authentication**: Test authenticated endpoints directly in the UI

## Common Development Tasks

### Adding New Dependencies

Add dependencies to specific packages:

```bash
# Backend dependency
pnpm --filter @nest-wise/core-api add package-name

# Frontend dependency
pnpm --filter @nest-wise/web add package-name

# Shared contracts dependency
pnpm --filter @nest-wise/contracts add package-name

# Development dependency for entire workspace
pnpm add -D package-name -w
```

### Database Migrations

TypeORM handles database schema automatically in development mode, but for production migrations:

```bash
# Generate migration
pnpm --filter @nest-wise/core-api npm run migration:generate -- -n MigrationName

# Run migrations
pnpm --filter @nest-wise/core-api npm run migration:run
```

### Debugging

#### Backend Debugging

The `start:debug` command enables debugging:

```bash
pnpm --filter @nest-wise/core-api start:debug
```

- Logs are formatted with pino-pretty for readability
- Debug information includes request/response details
- TypeORM query logging can be enabled in configuration

#### Frontend Debugging

Vite provides excellent development experience:

- Hot module replacement for instant updates
- Source maps for debugging
- React DevTools support
- Network request debugging in browser tools

## Troubleshooting

### Common Issues and Solutions

#### 1. Node Version Warning

**Issue**: Warning about unsupported Node version (wanted >=22.12.0, current v20.19.5)

**Solution**: The application works fine with v20.19.5 despite the warning. Upgrade to v22.12.0+ to eliminate warnings.

#### 2. Pino-Pretty Certificate Issues

**Issue**: `pnpm dev` or `make dev` fails with certificate errors

**Solution**: Use individual start commands instead:

```bash
pnpm --filter @nest-wise/core-api start:debug
pnpm --filter @nest-wise/web dev
```

#### 3. RESEND_API_KEY Required

**Issue**: Backend fails to start without RESEND_API_KEY

**Solution**: Set dummy value in `.env`:

```bash
RESEND_API_KEY=dummy-key-for-dev
```

#### 4. Port Already in Use

**Issue**: Ports 8080 or 5173 are already in use

**Solution**: Stop other services or modify ports in configuration files

#### 5. Database Connection Issues

**Issue**: Cannot connect to PostgreSQL

**Solution**:

- Ensure Docker services are running: `docker compose up -d`
- Check database credentials in `.env` file
- Verify PostgreSQL container is healthy: `docker ps`

#### 6. Redis Connection Issues

**Issue**: BullMQ or caching fails

**Solution**:

- Ensure Redis container is running: `docker compose ps`
- Check Redis connection in `.env` file
- Test Redis connectivity: `redis-cli -h localhost -p 6379 ping`

### Performance Notes

#### Critical Timing Information

- **Never cancel** build operations before 2 minutes
- **Never cancel** lint operations before 1 minute
- **Never cancel** install operations before 3 minutes
- Set explicit timeouts: build (120s), lint (60s), install (180s)
- Docker startup takes 10-15 seconds
- Development servers start in 5-10 seconds each

### Development Tips

1. **Incremental Development**: Use contracts watch mode when changing shared types
2. **API Testing**: Use Swagger UI for interactive API testing
3. **Database Inspection**: Use PgAdmin for database schema and data inspection
4. **Cache Debugging**: Use RedisInsight to inspect cache and queue data
5. **Log Monitoring**: Backend logs provide detailed request/response information
6. **Type Safety**: Leverage TypeScript strict mode and shared contracts for type safety

## Next Steps

Once your development environment is set up:

1. **Explore the API**: Visit http://localhost:8080/swagger
2. **Test the Frontend**: Navigate to http://localhost:5173
3. **Review the Codebase**: Start with `src/main.ts` and `src/app.module.ts`
4. **Make Changes**: Follow the build → lint → test cycle
5. **Contribute**: Submit PRs with proper validation
