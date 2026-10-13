# One image for api, worker and bot (the command picks the app).
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
# npm 10 crashes on this tree (edgesOut bug), so npm 11 is used.
RUN npx -y npm@11 ci --no-audit --no-fund
COPY . .
RUN npm run build && npm run db:build && npx -y npm@11 prune --omit=dev

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# A fresh named volume copies this directory's owner, so uploads are writable.
RUN mkdir -p /data/storage && chown node:node /data/storage
USER node
CMD ["node", "dist/apps/api/main.js"]
