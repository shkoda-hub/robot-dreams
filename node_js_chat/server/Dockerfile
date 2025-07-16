## dependencies
FROM node:lts-alpine as deps
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm install

## dev
FROM deps as dev
WORKDIR /app
EXPOSE 3000
COPY . .
CMD ["npm", "run", "start:dev"]

## prod
FROM deps AS builder
WORKDIR /app
COPY . .
RUN npm build
RUN npm prune --production

FROM node:lts-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
