# Build stage
FROM node:20-slim AS build
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files first (better caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/env/package.json ./packages/env/
COPY packages/shared/package.json ./packages/shared/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages ./packages
COPY apps ./apps

# Client env vars - needed at build time
ARG VITE_API_URL
ARG VITE_TEST__KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_TEST__KEY=$VITE_TEST__KEY

# Build Vite app
RUN pnpm --filter web build

# Production stage
FROM node:20-slim
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace structure for pnpm
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/pnpm-workspace.yaml ./

# Copy packages (needed as workspace dependencies)
COPY --from=build /app/packages ./packages

# Copy api app
COPY --from=build /app/apps/api ./apps/api

# Install dependencies (need tsx from devDependencies to run TypeScript)
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/api

EXPOSE 3000

CMD ["npx", "tsx", "src/index.ts"]