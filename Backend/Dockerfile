# =========================================================
# SmartClinic Backend Dockerfile — Production Node.js Runtime
# =========================================================
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies (only production in final container)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code and uploads folder
COPY . .

# Ensure uploads directory exists and is writable
RUN mkdir -p uploads/profile && chown -R node:node /app

# Run as non-root user for security
USER node

# Expose server port
EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server.js"]
