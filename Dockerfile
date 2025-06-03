# Dockerfile
FROM node:18-alpine AS development

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy root files first
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./
COPY prisma ./prisma
COPY .env .env

RUN pnpm install
RUN pnpm prisma generate

COPY . .

# USER node

# FROM node:18-alpine AS build
# WORKDIR /usr/src/app
# COPY --from=development /usr/src/app/node_modules ./node_modules
# COPY . .
# RUN pnpm run build

# FROM node:18-alpine AS production
# WORKDIR /usr/src/app
# COPY --from=build /usr/src/app/dist ./dist
# CMD ["node", "dist/main.js"]
