FROM oven/bun:1@sha256:7608db4aeb44f1fe8169cc8ec7055376b3013557b106407ccf092b00e426407d AS builder
WORKDIR /app
COPY package.json bun.lock .
COPY project.inlang ./project.inlang
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM node:lts-alpine@sha256:2867d550cf9d8bb50059a0fff528741f11a84d985c732e60e19e8e75c7239c43
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
