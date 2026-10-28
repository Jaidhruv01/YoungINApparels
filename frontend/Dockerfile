# ==============================================================================
# Multi-stage Dockerfile for YoungIN Apparels React Frontend (Production / AWS)
# ==============================================================================

# Stage 1: Node Build Environment
FROM node:20-alpine AS builder

WORKDIR /app

# Optional build argument if backend API is hosted on a dedicated domain or ALB
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci --prefer-offline || npm install

COPY . .

# Compile optimized static bundle
RUN npm run build

# Stage 2: High-Performance Production Nginx Server
FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

# Clean default nginx files
RUN rm -rf ./*

# Copy built artifacts from builder stage
COPY --from=builder /app/dist .

# Copy custom production nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# AWS ALB / Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
