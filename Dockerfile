FROM node:18-slim

# Update repo dan install Nginx + gettext (untuk envsubst)
RUN apt-get update && apt-get install -y nginx gettext-base && rm -rf /var/lib/apt/lists/*

# Buat folder kerja
WORKDIR /app

# Copy dependency dan install
COPY package*.json ./
RUN npm install -g pnpm && pnpm install --production

# Copy source code aplikasi dan config nginx
COPY . .

# Jalankan aplikasi dengan Nginx
CMD /bin/bash -c "npm run start & sleep 5 && envsubst '\$PORT' < nginx.conf > /etc/nginx/nginx.conf && nginx -g 'daemon off;' -c /etc/nginx/nginx.conf"

