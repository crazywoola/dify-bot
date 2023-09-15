FROM node:18.17.0-alpine AS base

FROM base as packages
LABEL maintainer="banana@dify.ai"
# install deps
WORKDIR /app/playground
COPY package.json .
COPY yarn.lock .
RUN yarn --only=prod

# build resources
FROM base as production
ARG COMMIT_SHA
ENV COMMIT_SHA ${COMMIT_SHA}
WORKDIR /app/playground
COPY --from=packages /app/playground/ .
COPY . .
RUN yarn start

