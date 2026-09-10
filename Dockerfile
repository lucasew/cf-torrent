FROM node:lts-alpine@sha256:50c8e8ca1d27439048670df5883f32d57cf81cff6233222c893fd0d9884cbd81 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY project.inlang ./project.inlang
RUN npm ci
COPY . .
ENV ASTRO_ADAPTER=node
RUN npx astro telemetry disable && npm run build

FROM node:lts-alpine@sha256:50c8e8ca1d27439048670df5883f32d57cf81cff6233222c893fd0d9884cbd81
RUN apk add curl
WORKDIR /app
COPY --from=builder /app/dist dist/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
CMD [ "node", "./dist/server/entry.mjs" ]
