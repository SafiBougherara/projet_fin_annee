# Stage 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (cache layer optimization)
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci

# Copy source
COPY . .

# Build for production (outputs to /app/dist)
RUN npm run build

# Stage 2 — Serve with nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config: handle React Router (SPA) and proxy /api to backend
RUN printf 'server {\n\
    listen 3000;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    # Handle React Router — always serve index.html for unknown routes\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
