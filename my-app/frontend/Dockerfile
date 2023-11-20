FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run test

RUN npm run build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html