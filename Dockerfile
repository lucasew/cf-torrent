FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock .
COPY project.inlang ./project.inlang/
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM node:lts-alpine
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
