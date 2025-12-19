FROM oven/bun:1@sha256:fbf8e67e9d3b806c86be7a2f2e9bae801f2d9212a21db4dcf8cc9889f5a3c9c4 AS builder
WORKDIR /app
COPY package.json bun.lock .
COPY project.inlang ./project.inlang
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM node:lts-alpine@sha256:c921b97d4b74f51744057454b306b418cf693865e73b8100559189605f6955b8
# bun can't deal with socket activation on systemd yet
# FROM oven/bun:1-alpine
RUN apk add curl
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
# CMD [ "bun", "./build" ]
CMD [ "node", "./build" ]
