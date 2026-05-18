# Production stage
FROM nginx:stable-alpine AS production-stage

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files from build context
# In CI, we download the artifact to .output/public before building
# Locally, ensure you run 'npm run generate' first.
COPY .output/public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
