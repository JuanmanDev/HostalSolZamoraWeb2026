# Stage 1: Build
FROM --platform=$BUILDPLATFORM node:20-slim AS build-stage

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate static site
RUN npm run generate

# Stage 2: Serve
FROM nginx:stable-alpine AS production-stage

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files from build stage
# Nuxt generate output is in .output/public
COPY --from=build-stage /app/.output/public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
