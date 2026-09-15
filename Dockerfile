FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim AS runtime
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm install tsx
COPY --from=build /app/dist ./dist
COPY server ./server
COPY drizzle.config.ts ./

EXPOSE 3000
ENV PORT=3000
CMD ["node", "--import", "tsx", "server/index.ts"]
