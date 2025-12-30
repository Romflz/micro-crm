# Build stage
FROM node:20-slim AS build
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/env/package.json ./packages/env/
COPY packages/shared/package.json ./packages/shared/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile

COPY packages ./packages
COPY apps ./apps

# Build frontend (outputs to apps/api/public)
RUN pnpm --filter web build

# Build backend (outputs to apps/api/dist)
RUN pnpm --filter api build

# Production stage
FROM node:20-slim
WORKDIR /app

RUN npm install -g pnpm

COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/pnpm-workspace.yaml ./
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/public ./apps/api/public
COPY --from=build /app/apps/api/package.json ./apps/api/

RUN pnpm install --production --frozen-lockfile

WORKDIR /app/apps/api

EXPOSE 3000

CMD ["node", "dist/index.js"]