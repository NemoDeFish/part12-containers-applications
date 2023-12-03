FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

# Solution: uses `npm ci` for development instead of `npm install`
RUN npm install

USER node

# Solution: uses normal `npm run dev` instead of bracket notation
CMD ["npm", "run", "dev"]