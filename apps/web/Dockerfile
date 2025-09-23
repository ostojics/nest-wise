FROM node:22 AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY packages/contracts/package.json packages/contracts/package.json
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter @nest-wise/web build

RUN pnpm prune --prod

FROM nginx:1.27-alpine AS runner
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80

