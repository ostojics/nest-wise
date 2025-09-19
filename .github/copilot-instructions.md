## Expert Guidelines for Web and App Development

This document outlines a set of expert-level rules and conventions for developing modern web and mobile applications. It covers a range of topics, including API design, UI/UX principles, and specific best practices for popular technologies.

1. API Design Guide: Sorting, Filtering, and Searching

This section outlines conventions for creating simple yet professional RESTful APIs.

1.1. Filtering

Use query parameters for all filtering. For simple, exact matches, use the field name as the parameter. For advanced filtering, append an underscore and an operator to the field name.

    Simple Filtering: GET /resources?field_name=value

        Example: GET /products?category=electronics

    Advanced Operators: Use _gt, _gte, _lt, _lte, _in, and _like.

        Example: GET /products?price_gt=50

    Date Range: Use _from and _to suffixes.

        Example: GET /orders?createdAt_from=2023-01-01T00:00:00Z&createdAt_to=2023-03-31T23:59:59Z

1.2. Sorting

Use the sort query parameter. Use a hyphen (-) prefix for descending order.

    Convention: GET /resources?sort=field1,-field2

        Example: GET /products?sort=-price,name

1.3. Pagination

Use simple page and pageSize parameters. Include metadata in the response to provide context to the client.

    Convention: GET /resources?page=page_number&pageSize=items_per_page

        Example: GET /products?page=1&pageSize=10

    Response Structure:
    JSON

    {
      "data": [
        // Array of resource objects
      ],
      "meta": {
        "totalCount": 50,
        "pageSize": 10,
        "currentPage": 1,
        "totalPages": 5
      }
    }

2. UI/UX Design Principles

You are an expert in UI/UX design. Use these principles to create intuitive, accessible, and performant user interfaces.

    Visual Design: Establish a clear visual hierarchy, use a cohesive color palette, and maintain sufficient contrast.

    Interaction Design: Create intuitive navigation, use familiar UI components, and provide clear calls-to-action.

    Accessibility: Adhere to WCAG guidelines. Use semantic HTML and provide alternative text for non-text content. Ensure full keyboard navigability.

    Responsive Design: Use a mobile-first approach. Use relative units (%, em, rem) and CSS Grid/Flexbox for fluid layouts. Use media queries to adjust layouts for different screen sizes.

    Performance: Optimize images and assets, implement lazy loading, and monitor Core Web Vitals.

    User Feedback: Incorporate clear feedback mechanisms for user actions, including loading indicators and helpful error messages.

    Consistency: Develop and adhere to a design system. Use consistent terminology and styling throughout the application.

3. General Web Development Guidelines

This section provides general guidelines for building web products and generating code.

3.1. Code Style and Structure

    Write concise, readable, and type-safe TypeScript.

    Use functional components and hooks over class components.

    Organize files by feature, grouping related code together.

    Avoid barrel imports (index.ts files).

    Do NOT write comments in the code unless explicitly asked.

3.2. Naming Conventions

    camelCase for variables and functions (isFetchingData).

    PascalCase for components (UserProfile).

    lowercase-hyphenated for directory names (user-profile).

3.3. TypeScript Usage

    Use TypeScript for all components.

    Enable strict typing in tsconfig.json.

    Avoid using any. Strive for precise types.

3.4. Performance Optimization

    Minimize heavy computations inside render methods.

    Use React.memo() to prevent unnecessary re-renders.

    For web, use Next.js features like next/image and next/link.

    For React Native, optimize FlatLists with removeClippedSubviews and getItemLayout.

3.5. UI and Styling

    For web, use Tailwind CSS or Shadcn/ui for reusable, responsive components.

    For React Native, use StyleSheet.create().

    Use responsive images with srcset and sizes attributes for the web.

3.6. Framework-Specific Guidelines

React Native & Expo

    Use Expo's managed workflow.

    Leverage Expo SDK for native features.

    Use react-navigation for navigation.

Next.js

    Use file-based routing and API routes.

    Implement ISR (Incremental Static Regeneration) or SSG (Static Site Generation) where appropriate.

Tailwind & Shadcn/ui

    Use Tailwind's utility classes for rapid UI development.

    Customize Shadcn/ui components to match the design system.

Container query sizes reference

    Tailwind includes container sizes ranging from 16rem (256px) to 80rem (1280px).

    Example: @md corresponds to @container (width >= 28rem) { … }

4. Codebase Overview

This monorepo contains a NestJS backend (core API), a React web client, and shared TypeScript contracts. It uses pnpm workspaces, TypeORM, Zod, and Swagger.

4.1. Monorepo layout

- apps/core-api: NestJS backend service
- apps/web: React (Vite) web client
- packages/contracts: Shared DTOs, schemas, and TypeScript contracts consumed by both backend and frontend
- tooling/: Shared linting/tsconfig presets

  4.2. Backend (apps/core-api)

- Framework: NestJS 11 (TypeORM, Swagger, BullMQ, Throttler, Schedule)
- Entities: Household, User, Account, Category, Transaction, PrivateTransaction, Savings, CategoryBudget
- Modules: auth, users, households, accounts, categories, transactions, category-budgets, private-transactions, savings, policies
- Validation: Zod via a custom ZodValidationPipe; DTOs/schemas live in @nest-wise/contracts
- Auth: JWT-based, cookie set on login/setup; guard `AuthGuard` protects routes; `@CurrentUser()` provides JwtPayload
- API versioning: URI versioning enabled (e.g., /v1/...)
- Logging: pino-nestjs; pretty logs in dev
- Swagger: auto-setup via tools/swagger; endpoints and examples documented
- CORS: enabled for http://localhost:5173 with credentials

  4.2.1. Important paths

- src/app.module.ts: root module registering all feature modules
- src/main.ts: bootstrapping (versioning, helmet, cookies, CORS, swagger)
- src/common: guards, decorators (e.g., CurrentUser), enums, interfaces
- src/tools/swagger: OpenAPI DTOs for documentation

  4.2.2. Data model relations (high-level)

- Household 1—N Users, Accounts, Categories, Transactions, Savings, CategoryBudgets
- User N—1 Household; owns many Accounts
- Account N—1 Household; N—1 User (owner); 1—N Transactions
- Category N—1 Household; 1—N Transactions
- Transaction N—1 Household; N—1 Account; N—1 Category (nullable)
- PrivateTransaction N—1 Household; N—1 Account; N—1 User (owner)

  4.2.3. API conventions

- Filtering/search: query params; operators like \_gt/\_gte/\_lt/\_lte/\_in/\_like; date ranges use date_from/date_to (aliases from/to accepted during deprecation); pagination page/pageSize with meta
- Sorting: sort=field,-field2; default sort set per endpoint (e.g., -transactionDate)
- Authentication required for most endpoints; auth cookie (httpOnly) used

  4.2.4. Repositories/Services

- Each module has a service that encapsulates business logic and a repository that wraps TypeORM queries
- Repositories often expose filter-by-household helpers and complex query builders for pagination/sorting

  4.3. Frontend (apps/web)

- Stack: React + Vite + TypeScript; ky HTTP client with prefixUrl VITE_API_URL and credentials included
- API clients live in apps/web/src/modules/api; they consume @nest-wise/contracts types
- Auth handling: ky afterResponse hook redirects to /login on 401/403 for non-public routes
- Router: react-router; generated route tree present

  4.4. Local development

- Install: pnpm install
- Run backend: pnpm --filter @nest-wise/core-api dev
- Run web: pnpm --filter @nest-wise/web dev (ensure VITE_API_URL points to backend, default CORS origin is http://localhost:5173)
- Env/config: Backend config via Nest ConfigModule; see src/config/\* for app, database, queues; DB via TypeORM (Postgres)

  4.5. Testing

- Backend: jest unit/e2e; run via pnpm --filter @nest-wise/core-api test:e2e
- Contracts: type safety validated across packages by TypeScript

  4.6. Security & policies

- Authorization decisions centralized in Policies module; controllers/services call Policies before mutating sensitive resources (e.g., account update, transfers)
- Deletion cascades configured in entities (e.g., on household deletion)

  4.7. Upcoming API refactor (high-level)

- Collections will be nested under household (e.g., /v1/households/{householdId}/transactions)
- Private transactions will be under /v1/users/me/private-transactions
- date_from/date_to are the standard date filters; legacy names are deprecated with a sunset plan

  4.8. Tips for contributors

- Prefer using shared contracts from @nest-wise/contracts for DTOs and types
- Validate all inputs with ZodValidationPipe + contracts schemas
- Keep endpoints CRUD-oriented and scoped to parent resources when applicable
- Use repository methods for DB access; avoid inline query logic in services
- Update Swagger DTOs/examples whenever endpoints or DTOs change
