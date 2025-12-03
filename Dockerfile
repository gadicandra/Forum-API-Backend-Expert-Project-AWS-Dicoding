FROM node:18-slim

# Install build tools, Nginx & gettext (untuk bcrypt native module)
RUN apt-get update && apt-get install -y \
    nginx \
    gettext-base \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Buat folder kerja
WORKDIR /app

# Copy dependency dan install
COPY package*.json ./
RUN npm install --production

# Copy source code aplikasi dan config nginx
COPY . .

# Jalankan aplikasi dengan Nginx
CMD /bin/bash -c "npm run start & sleep 5 && envsubst '\$PORT' < nginx.conf > /etc/nginx/nginx.conf && nginx -g 'daemon off;' -c /etc/nginx/nginx.conf"
