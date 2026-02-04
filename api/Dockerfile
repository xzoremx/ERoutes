# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (cache layer)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
# Asumimos que el script de build es "npm run build" y genera salida en ./dist
RUN npm run build 

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy package.json to install only production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/src/docs ./src/docs # (Opcional: si tienes docs estáticos)

# User non-root for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

# Start command
CMD ["npm", "start"]
