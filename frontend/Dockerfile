#1- build
FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .


ENV VITE_API_BASE_URL="https://pokemon-defensive-profile-295929563912.us-central1.run.app"
RUN pnpm build

# 2- prod
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass https://pokemon-defensive-profile-295929563912.us-central1.run.app/; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host pokemon-defensive-profile-295929563912.us-central1.run.app; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]