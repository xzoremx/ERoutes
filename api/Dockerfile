# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies (cache layer)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy package.json to install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# User non-root for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Railway assigns PORT dynamically
EXPOSE 3001

# Health check for Railway
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3001}/health || exit 1

# Start command
CMD ["npm", "start"]
