# Build stage
FROM node:20.2.0-alpine AS builder
LABEL maintainer="banana@dify.ai"
WORKDIR /app/playground

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy all other files and build
COPY . .
RUN npm run build

# Production stage
FROM node:20.2.0-alpine AS production
ENV NODE_ENV=production
WORKDIR /app/playground

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built code and necessary files
COPY --from=builder /app/playground/dist ./dist
COPY docker/entrypoint.sh ./entrypoint.sh

# Final operations
RUN chmod +x ./entrypoint.sh
ARG COMMIT_SHA
ENV COMMIT_SHA=${COMMIT_SHA}
ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]
