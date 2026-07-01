# Stage 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app

# Context is repo root, so frontend/ prefix is needed
COPY frontend/package*.json ./

# Install all dependencies
RUN npm install

# Copy frontend source
COPY frontend/ .

# Receive VITE_* build-time variables from Railway
ARG VITE_API_URL
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env

# Build for production (outputs to /app/dist)
RUN npm run build

# Stage 2 — Serve with nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config: handle React Router (SPA)
RUN printf 'server {\n\
    listen 3000;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
