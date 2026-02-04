# Stage 1: Base
FROM node:20-alpine AS base

# Stage 2: Deps
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Instalar dependencias (usando 'npm ci' para builds reproducibles)
RUN npm ci

# Stage 3: Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desactivar telemetría durante el build
ENV NEXT_TELEMETRY_DISABLED 1

# Build del proyecto (Next.js)
RUN npm run build

# Stage 4: Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos públicos y el build standalone
COPY --from=builder /app/public ./public

# Configura Next.js para output: 'standalone' en next.config.js para que esto funcione
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
