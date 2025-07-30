FROM node:lts-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["sh", "-c", "npm run migration:run && npm run start:dev"]
