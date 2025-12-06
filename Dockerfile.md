# Dockerfile

# STAGE 1: Build the React Application
FROM node:18-alpine AS builder

WORKDIR /app

# 1. Install Dependencies with Verbose Logging
# We use --verbose to help diagnose network/package issues during build
COPY package.json .
RUN npm cache clean --force && \
    npm install --verbose --no-audit --no-fund --fetch-timeout=600000

# 2. Structure the App
# React Scripts expects a specific structure. We reorganize the flat file structure.
RUN mkdir -p public src/components src/docs
COPY . .
RUN mv index.html metadata.json public/ 2>/dev/null || true
RUN mv *.tsx *.ts src/ 2>/dev/null || true
RUN mv simulated_data.ts src/ 2>/dev/null || true
RUN cp -r components/* src/components/ 2>/dev/null || true && rm -rf components
RUN cp -r docs/* src/docs/ 2>/dev/null || true && rm -rf docs

# 3. Build Production Bundle
ENV CI=false
ENV NODE_ENV=production
RUN npm run build

# STAGE 2: Serve with Nginx (Production Ready)
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Create a custom Nginx config for React Router and Port 3050
RUN echo 'server { \
    listen 3050; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    # Enable Gzip compression \
    gzip on; \
    gzip_types text/plain application/xml text/css application/javascript; \
    gzip_min_length 1000; \
}' > /etc/nginx/conf.d/default.conf

# Expose the port
EXPOSE 3050

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]