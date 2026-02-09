# Multi-stage build for production-ready Vite React SPA

# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm@latest && \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set default build-time environment variables
# These can be overridden at build time with --build-arg
ARG II_URL=https://identity.ic0.app
ARG NODE_ENV=production

# Export as environment variables for the build process
ENV II_URL=${II_URL}
ENV NODE_ENV=${NODE_ENV}

# Build the application (skip backend bindings generation)
RUN pnpm run build:skip-bindings

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a runtime configuration script
# This allows environment variables to be injected at container start time
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-generate-env-config.sh && \
    echo 'cat > /usr/share/nginx/html/runtime-env.js <<EOF' >> /docker-entrypoint.d/40-generate-env-config.sh && \
    echo 'window.ENV = {' >> /docker-entrypoint.d/40-generate-env-config.sh && \
    echo '  II_URL: "${II_URL:-https://identity.ic0.app}"' >> /docker-entrypoint.d/40-generate-env-config.sh && \
    echo '};' >> /docker-entrypoint.d/40-generate-env-config.sh && \
    echo 'EOF' >> /docker-entrypoint.d/40-generate-env-config.sh && \
    chmod +x /docker-entrypoint.d/40-generate-env-config.sh

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx (entrypoint scripts run automatically)
CMD ["nginx", "-g", "daemon off;"]
