FROM node:22-alpine AS base

FROM base AS builder
RUN apk update

WORKDIR /app

RUN npm i pnpm@10.11.1 -g
COPY . .

RUN pnpm dlx turbo@^2.5.3 prune @nest-wise/web --docker

FROM base AS installer

WORKDIR /app

RUN npm i pnpm@10.11.1 -g

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build

FROM nginx:1.27-alpine AS runner

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=installer /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80