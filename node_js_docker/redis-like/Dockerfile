FROM node:lts-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY redis-like/. .
EXPOSE 4000

CMD ["node", "server.ts"]
