FROM node:18.17.0-alpine AS base

FROM base as packages
LABEL maintainer="banana@dify.ai"
# install deps
WORKDIR /app/playground
COPY package.json .
COPY package-lock.json .
RUN npm ci --only=production

# build resources
FROM base as production
ARG COMMIT_SHA
ENV COMMIT_SHA ${COMMIT_SHA}
WORKDIR /app/playground
COPY --from=packages /app/playground/ .
COPY . .
RUN npm start

