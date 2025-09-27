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

# Accept build args for version information
ARG APP_VERSION
ARG GIT_SHA  
ARG BUILD_DATE

# Set environment variables from build args
ENV APP_VERSION=${APP_VERSION}
ENV GIT_SHA=${GIT_SHA}
ENV BUILD_DATE=${BUILD_DATE}

RUN pnpm turbo run build

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestwise

USER nestwise

COPY --from=installer --chown=nestwise:nodejs /app .

# Add OCI labels for version information
ARG APP_VERSION
ARG GIT_SHA
ARG BUILD_DATE

LABEL org.opencontainers.image.version=${APP_VERSION}
LABEL org.opencontainers.image.revision=${GIT_SHA}
LABEL org.opencontainers.image.created=${BUILD_DATE}
LABEL org.opencontainers.image.source=https://github.com/ostojics/nest-wise
LABEL org.opencontainers.image.title="NestWise Core API"
LABEL org.opencontainers.image.description="NestWise Core API Backend Service"

CMD ["node", "apps/core-api/dist/main.js"]