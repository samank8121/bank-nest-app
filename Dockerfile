# Dockerfile
FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

USER node

FROM node:18-alpine AS build
WORKDIR /usr/src/app
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
CMD ["node", "dist/main.js"]
