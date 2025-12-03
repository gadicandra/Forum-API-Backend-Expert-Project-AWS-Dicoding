#!/bin/bash

# 1. Start Node.js application in background
pnpm run start &

# 2. Wait for application to be ready
sleep 5

# 3. Replace $PORT variable in nginx.conf with actual PORT from Railway
# Railway provides a random port via the $PORT environment variable
envsubst '$PORT' < nginx.conf > /etc/nginx/nginx.conf

# 4. Start Nginx in foreground (prevents container from exiting)
nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
