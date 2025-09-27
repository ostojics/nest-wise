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

# Accept build args for version information
ARG VITE_API_URL
ARG VITE_APP_VERSION
ARG VITE_GIT_COMMIT
ARG VITE_BUILD_DATE

# Set environment variables from build args
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_VERSION=${VITE_APP_VERSION}
ENV VITE_GIT_COMMIT=${VITE_GIT_COMMIT}
ENV VITE_BUILD_DATE=${VITE_BUILD_DATE}

RUN pnpm turbo run build

FROM nginx:1.27-alpine AS runner

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=installer /app/apps/web/dist /usr/share/nginx/html

# Add OCI labels for version information
ARG VITE_APP_VERSION
ARG VITE_GIT_COMMIT
ARG VITE_BUILD_DATE

LABEL org.opencontainers.image.version=${VITE_APP_VERSION}
LABEL org.opencontainers.image.revision=${VITE_GIT_COMMIT}
LABEL org.opencontainers.image.created=${VITE_BUILD_DATE}
LABEL org.opencontainers.image.source=https://github.com/ostojics/nest-wise
LABEL org.opencontainers.image.title="NestWise Web App"
LABEL org.opencontainers.image.description="NestWise Web Frontend Application"

EXPOSE 80