# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN mkdir -p uploads && chown -R nodeuser:nodejs /app
USER nodeuser
EXPOSE 5000
CMD ["node", "server.js"]
