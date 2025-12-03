# Dockerfile

Copy the content below into a file named `Dockerfile` to build the application.

```dockerfile
# Stage 1: Build the React Application
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json* ./

# Install dependencies (ci is faster and more reliable for builds)
RUN npm ci --silent

# Copy source code
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output from Stage 1 to Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config if you have one (Optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```