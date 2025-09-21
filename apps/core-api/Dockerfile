FROM node:22 AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY packages packages
COPY apps/core-api apps/core-api

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @nest-wise/core-api build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/core-api ./apps/core-api
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules

WORKDIR /app/apps/core-api

CMD ["node", "dist/main.js"]