# NestWise Monorepo Development Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites and Environment Setup

Install required Node.js version and pnpm:

- **Node Version**: v22.12.0 or higher (check .nvmrc file)
- **Package Manager**: pnpm v10.11.1
- Current environment uses Node v20.19.5 which shows warnings but works

Install pnpm globally:

```bash
npm install -g pnpm@10.11.1
```

### Bootstrap, Build, and Test the Repository

Install dependencies:

```bash
pnpm install
```

- Takes approximately 1.5 minutes. NEVER CANCEL. Set timeout to 3+ minutes.

Build all applications and packages:

```bash
pnpm build
```

- Takes approximately 50 seconds. NEVER CANCEL. Set timeout to 2+ minutes.
- Builds @nest-wise/contracts, @nest-wise/core-api, and @nest-wise/web packages

Lint all code:

```bash
pnpm lint
```

- Takes approximately 32 seconds. NEVER CANCEL. Set timeout to 1+ minute.

### Development Environment Setup

Set up Docker services (PostgreSQL, Redis, PgAdmin, RedisInsight):

```bash
docker compose up -d
```

- Takes 10-15 seconds for initial setup
- Services run on ports: PostgreSQL (5432), Redis (6379), PgAdmin (5050), RedisInsight (5540)

Set up environment files:

```bash
# Backend environment
cp apps/core-api/.env.example apps/core-api/.env
# Web frontend environment
cp apps/web/.env.example apps/web/.env
```

**CRITICAL**: Update `apps/core-api/.env` with a dummy value for RESEND_API_KEY:

```bash
RESEND_API_KEY=dummy-key-for-dev
```

### Run Development Servers

Start all development servers with Docker dependencies:

```bash
make dev
```

**WARNING**: This command may fail due to pino-pretty certificate issues. Use individual commands instead.

Start backend API (alternative method):

```bash
pnpm --filter @nest-wise/core-api start:debug
```

- Runs on http://localhost:8080
- Swagger API documentation available at http://localhost:8080/swagger
- Takes 5-10 seconds to start

Start web frontend:

```bash
pnpm --filter @nest-wise/web dev
```

- Runs on http://localhost:5173
- Takes 5-10 seconds to start after dependencies are built

Start contracts package in watch mode:

```bash
pnpm --filter @nest-wise/contracts dev
```

## Validation

### Manual Testing Requirements

Always manually validate functionality after making changes:

1. **API Health Check**: `curl http://localhost:8080/` should return "Hello World!"
2. **Web App Loading**: `curl http://localhost:5173/` should return HTML with "NestWise" title
3. **Swagger Documentation**: `curl http://localhost:8080/swagger` should return Swagger UI HTML

### Test Suite Status

**KNOWN ISSUE**: Unit tests currently fail due to path resolution issues:

```bash
pnpm --filter @nest-wise/core-api test
```

- Returns exit code 1 with module resolution errors
- Do NOT rely on unit tests for validation currently
- E2E tests exist but are not validated in this setup

### Pre-commit Validation

Always run these commands before committing:

```bash
pnpm lint
pnpm build
```

- Lint takes ~32 seconds, build takes ~50 seconds
- Both must pass for CI pipeline to succeed

## Common Tasks and Project Structure

### Monorepo Layout

```
apps/
  core-api/          # NestJS backend API (port 8080)
  web/               # React + Vite frontend (port 5173)
packages/
  contracts/         # Shared TypeScript types and DTOs
tooling/
  eslint/           # Shared ESLint configuration
  typescript/       # Shared TypeScript configuration
```

### Key Scripts Reference

| Command        | Description                    | Timing                            |
| -------------- | ------------------------------ | --------------------------------- |
| `pnpm install` | Install all dependencies       | ~1.5 minutes                      |
| `pnpm build`   | Build all apps and packages    | ~50 seconds                       |
| `pnpm lint`    | Lint all code                  | ~32 seconds                       |
| `pnpm dev`     | Start all dev servers          | May fail, use individual commands |
| `make dev`     | Start Docker + all dev servers | May fail, use individual commands |

### Individual App Commands

Backend (core-api):

```bash
pnpm --filter @nest-wise/core-api <command>
```

Available commands: `build`, `start:debug`, `dev`, `test`, `test:e2e`, `lint`

Frontend (web):

```bash
pnpm --filter @nest-wise/web <command>
```

Available commands: `build`, `dev`, `lint`, `preview`

Contracts (shared types):

```bash
pnpm --filter @nest-wise/contracts <command>
```

Available commands: `build`, `dev`, `lint`

### Configuration Files

- **Docker**: `docker-compose.yml` - PostgreSQL, Redis, PgAdmin, RedisInsight
- **Turborepo**: `turbo.json` - Build pipeline configuration
- **Package Management**: `pnpm-workspace.yaml` - Workspace definitions
- **Environment**: `.env.example` files in `apps/core-api/` and `apps/web/`

### Database and External Services

- **PostgreSQL**: localhost:5432 (user: root, password: root, db: nestwise_dev)
- **Redis**: localhost:6379
- **PgAdmin**: http://localhost:5050 (admin@admin.com / admin)
- **RedisInsight**: http://localhost:5540

### Technology Stack

- **Backend**: NestJS 11, TypeORM, PostgreSQL, Redis, BullMQ, Swagger
- **Frontend**: React 19, Vite 6, TailwindCSS 4, React Query, React Router
- **Shared**: TypeScript 5.8, Zod validation, ESLint 9, Prettier
- **Build System**: Turborepo 2.5, pnpm workspaces

### Common Issues and Workarounds

1. **Node Version Warning**: Shows warning with Node v20.19.5 but works fine
2. **Pino-Pretty Failure**: Certificate issues prevent `pnpm dev` from working, use `start:debug` instead
3. **RESEND_API_KEY Required**: Backend fails without this environment variable, use dummy value
4. **Unit Tests Failing**: Path resolution issues, rely on manual testing instead

## Critical Timing Information

- **NEVER CANCEL** build operations before 2 minutes
- **NEVER CANCEL** lint operations before 1 minute
- **NEVER CANCEL** install operations before 3 minutes
- Set explicit timeouts: build (120s), lint (60s), install (180s)
- Docker startup takes 10-15 seconds
- Development servers start in 5-10 seconds each

## API Design Guide and Codebase Context

### API Design Conventions

Use query parameters for all filtering. For simple, exact matches, use the field name as the parameter. For advanced filtering, append an underscore and an operator to the field name.

- Simple Filtering: `GET /resources?field_name=value`
- Advanced Operators: Use `_gt`, `_gte`, `_lt`, `_lte`, `_in`, and `_like`
- Date Range: Use `_from` and `_to` suffixes
- Sorting: Use `sort=field1,-field2` (hyphen for descending)
- Pagination: Use `page` and `pageSize` parameters with meta response

Response Structure:

```json
{
  "data": [
    /* Array of resource objects */
  ],
  "meta": {
    "totalCount": 50,
    "pageSize": 10,
    "currentPage": 1,
    "totalPages": 5
  }
}
```

### Codebase Overview

This monorepo contains a NestJS backend (core API), a React web client, and shared TypeScript contracts. It uses pnpm workspaces, TypeORM, Zod, and Swagger.

#### Backend (apps/core-api)

- Framework: NestJS 11 (TypeORM, Swagger, BullMQ, Throttler, Schedule)
- Entities: Household, User, Account, Category, Transaction, PrivateTransaction, Savings, CategoryBudget
- Modules: auth, users, households, accounts, categories, transactions, category-budgets, private-transactions, savings, policies
- Validation: Zod via a custom ZodValidationPipe; DTOs/schemas live in @nest-wise/contracts
- Auth: JWT-based, cookie set on login/setup; guard `AuthGuard` protects routes; `@CurrentUser()` provides JwtPayload
- API versioning: URI versioning enabled (e.g., /v1/...)
- Logging: pino-nestjs; pretty logs in dev
- Swagger: auto-setup via tools/swagger; endpoints and examples documented
- CORS: enabled for http://localhost:5173 with credentials

#### Important Paths

- `src/app.module.ts`: root module registering all feature modules
- `src/main.ts`: bootstrapping (versioning, helmet, cookies, CORS, swagger)
- `src/common`: guards, decorators (e.g., CurrentUser), enums, interfaces
- `src/tools/swagger`: OpenAPI DTOs for documentation

#### Data Model Relations (high-level)

- Household 1—N Users, Accounts, Categories, Transactions, Savings, CategoryBudgets
- User N—1 Household; owns many Accounts
- Account N—1 Household; N—1 User (owner); 1—N Transactions
- Category N—1 Household; 1—N Transactions
- Transaction N—1 Household; N—1 Account; N—1 Category (nullable)
- PrivateTransaction N—1 Household; N—1 Account; N—1 User (owner)

#### API Conventions

- Filtering/search: query params; operators like `_gt/_gte/_lt/_lte/_in/_like`; date ranges use `date_from/date_to` (aliases `from/to` accepted during deprecation); pagination `page/pageSize` with meta
- Sorting: `sort=field,-field2`; default sort set per endpoint (e.g., `-transactionDate`)
- Authentication required for most endpoints; auth cookie (httpOnly) used

#### Repositories/Services

- Each module has a service that encapsulates business logic and a repository that wraps TypeORM queries
- Repositories often expose filter-by-household helpers and complex query builders for pagination/sorting

#### Frontend (apps/web)

- Stack: React + Vite + TypeScript; ky HTTP client with prefixUrl VITE_API_URL and credentials included
- API clients live in `apps/web/src/modules/api`; they consume @nest-wise/contracts types
- Auth handling: ky afterResponse hook redirects to /login on 401/403 for non-public routes
- Router: react-router; generated route tree present

#### Local Development

- Install: `pnpm install`
- Run backend: `pnpm --filter @nest-wise/core-api start:debug`
- Run web: `pnpm --filter @nest-wise/web dev` (ensure VITE_API_URL points to backend, default CORS origin is http://localhost:5173)
- Env/config: Backend config via Nest ConfigModule; see `src/config/*` for app, database, queues; DB via TypeORM (Postgres)

#### Testing

- Backend: jest unit/e2e; run via `pnpm --filter @nest-wise/core-api test:e2e`
- Contracts: type safety validated across packages by TypeScript

#### Security & Policies

- Authorization decisions centralized in Policies module; controllers/services call Policies before mutating sensitive resources (e.g., account update, transfers)
- Deletion cascades configured in entities (e.g., on household deletion)

#### Tips for Contributors

- Prefer using shared contracts from @nest-wise/contracts for DTOs and types
- Validate all inputs with ZodValidationPipe + contracts schemas
- Keep endpoints CRUD-oriented and scoped to parent resources when applicable
- Use repository methods for DB access; avoid inline query logic in services
- Update Swagger DTOs/examples whenever endpoints or DTOs change
