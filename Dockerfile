FROM node:18-slim

# Install Nginx & Gettext (for envsubst command)
RUN apt-get update && apt-get install -y nginx gettext-base && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install Node.js dependencies using pnpm
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code & configuration files
COPY . .

# Give execute permission to start.sh
RUN chmod +x start.sh

# Expose port (Railway will override this)
EXPOSE 8080

# Run the startup script
CMD ["./start.sh"]
