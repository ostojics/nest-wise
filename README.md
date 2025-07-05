# Turborepo Starter

A template for building software using Turborepo, pnpm, and modern tooling. Designed to get you up and running quickly with a solid, scalable, and well-structured monorepo.

## Main principle - bring your own tools

This template is configured with minimal amount of packages and tooling to get started.
This provides a structured and scalable starting point and you can add new tools or remove existing ones.

## Features

- **Turborepo**: High-performance build system for monorepos.

- **pnpm**: Fast, disk space-efficient package manager.

- **TypeScript**: End-to-end type safety.

- **Shared Tooling**: Centralized ESLint and TypeScript configurations.

- **Shared Packages**: Share packages across multiple apps.

- **Pre-configured CI**: GitHub Actions workflow for building and linting on every push.

- **Pre-commit Hooks**: Automated code formatting with Husky and pretty-quick.

- **Custom Generators**: Automate repetitive tasks.

## Monorepo Structure

This repository uses a standard monorepo structure to organize applications and shared packages:

- `apps/`: Contains the individual applications.

- `packages/`: Contains shared packages that can be used across applications.

- `tooling/`: Contains shared tooling configurations.

## What's Inside?

This Turborepo starter includes the following apps and packages:

### Apps

- `apps/web`:

- A [Vite](https://vitejs.dev/)-powered React application.

- Uses shared `tsconfig.json` and ESLint configurations from the `tooling` directory.

- `apps/expo-app`:

- An [Expo](https://expo.dev/) managed React Native application.

- Can share code and types with the `web` application.

### Packages

- `packages/validation`:

- A placeholder for your shared validation logic.

### Tooling

- `tooling/eslint`:

- `base.js`: The base ESLint configuration for all packages.

- `react.js`: A specialized ESLint configuration for React-based applications.

- `tooling/typescript`:

- `base.json`: The base `tsconfig.json` for all packages.

- `internal-package.json`: A specialized `tsconfig.json` for internal packages.

## Getting Started

Make sure to have required versions of software specified in https://github.com/OpenSolve/turborepo-starter/blob/main/package.json#L23

To get started with this template, follow these steps:

1.  **Clone the repository:**

```bash

git clone git@github.com:OpenSolve/turborepo-starter.git

cd turborepo-starter

```

2.  **Install dependencies:**

This project uses `pnpm` as its package manager.

```bash

pnpm install

```

3.  **Run the development servers:**

This will start the development servers for all applications in the monorepo.

```bash

pnpm dev

```

## Key Scripts

Here are some of the most important scripts available at the root of the project:

| Script | Description |

| ------------------ | ------------------------------------------------ |

| `pnpm dev` | Starts the development servers for all apps. |

| `pnpm build` | Builds all apps and packages for production. |

| `pnpm lint` | Lints all code in the monorepo. |

| `pnpm format` | Formats all code using Prettier. |

| `pnpm analyze:web` | Analyzes the bundle size of the web application. |

| `pnpm create:package` | Scaffold a new shared package. |

## Shared Tooling

This starter is configured with shared ESLint and TypeScript configurations to ensure consistency across the entire codebase.

- **ESLint**: The configurations in `tooling/eslint` are extended by each app and package. For example, `apps/web/eslint.config.js` extends the shared configuration.

- **TypeScript**: The `tsconfig.json` files in each app and package extend the base configurations from `tooling/typescript` to reduce boilerplate.

## Dependency Management

This project uses [pnpm workspaces](https://pnpm.io/workspaces) to manage dependencies within the monorepo. The `pnpm-workspace.yaml` file at the root defines the locations of the packages.

The `catalog` feature of pnpm is used in `pnpm-workspace.yaml` to ensure that all packages use the same versions of common dependencies like React and TypeScript.

## CI/CD

The `.github/workflows/ci.yml` file contains a GitHub Actions workflow that is triggered on every pull request to the `main` branch. This workflow performs the following checks:

- Installs dependencies.

- Builds all applications and packages.

- Lints the entire codebase.

This helps to ensure that the code is always in a good state before it gets merged.

## Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks. A `pre-commit` hook is configured in `.husky/pre-commit` to run `pretty-quick --staged`, which formats the staged files using Prettier before each commit. This ensures that all committed code adheres to the defined code style.
