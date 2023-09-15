FROM node:18.17.0-alpine AS base

FROM base as packages
LABEL maintainer="banana@dify.ai"
# install deps
WORKDIR /app/playground
COPY package.json .
COPY package-lock.json .
RUN npm ci --only=production

# build resources
FROM base as builder
WORKDIR /app/playground
COPY --from=packages /app/playground/ .
COPY . .
RUN npm run build

# production stage
FROM base as production
ENV NODE_ENV production
WORKDIR /app/playground

COPY --from=builder /app/playground/dist ./dist
COPY docker/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
ARG COMMIT_SHA
ENV COMMIT_SHA ${COMMIT_SHA}

ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]
