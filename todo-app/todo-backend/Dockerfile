FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

# Solution: uses `npm ci` instead of `npm install`
RUN npm install

USER node

CMD npm start