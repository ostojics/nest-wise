FROM node:22-alpine AS base

FROM base AS builder
RUN apk update

WORKDIR /app

RUN npm i pnpm@10.11.1 -g
COPY . .

RUN pnpm dlx turbo@^2.5.3 prune @nest-wise/core-api --docker

FROM base AS installer

WORKDIR /app

RUN npm i pnpm@10.11.1 -g

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestwise

USER nestwise

COPY --from=installer --chown=nestwise:nodejs /app .

CMD ["node", "apps/core-api/dist/main.js"]