FROM node:lts-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY kv-server/. .
EXPOSE 4000

CMD ["node", "server.ts"]
