FROM node:lts-alpine
WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
RUN npm install

COPY src ./src

CMD ["npm", "run", "start:dev"]
