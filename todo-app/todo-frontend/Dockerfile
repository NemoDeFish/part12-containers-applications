# Solution: changes this to 'test-stage' instead of 'build-stage' 
FROM node:16 AS build-stage

WORKDIR /usr/src/app

# Solution: directly copies everything instead of only 'package*.json' for installing dependenncies
COPY package*.json ./

RUN npm ci

COPY . .

ENV CI=true

RUN npm run test

# Solution: sets another stage for building instead of combining it with the 'test-stage'. This better aligns with the instructions where we are building the tested code
# build

# FROM node:16 AS build-stage

# WORKDIR /usr/src/app

# COPY --from=test-stage /usr/src/app .

# Solution: adds 'http:' in front of '//' and a trailing '/', but this is not necessary
ENV REACT_APP_BACKEND_URL=//localhost:8080/api

RUN npm run build

# serve

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html