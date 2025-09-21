FROM node:22 AS builder
WORKDIR /app
ENV CI=true

RUN corepack enable

# Copy only workspace manifests first for better caching
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/contracts/package.json packages/contracts/package.json
COPY apps/core-api/package.json apps/core-api/package.json

RUN pnpm install --frozen-lockfile

# Build workspace packages used by core-api
COPY packages/contracts packages/contracts
RUN pnpm --filter @nest-wise/contracts build

# Build core-api
COPY apps/core-api apps/core-api
RUN pnpm --filter @nest-wise/core-api build

# Prune dev deps
RUN pnpm prune --prod

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/core-api/dist ./apps/core-api/dist

WORKDIR /app/apps/core-api
EXPOSE 8080
CMD ["node", "dist/main.js"]


