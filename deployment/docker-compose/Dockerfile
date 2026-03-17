FROM node:lts-alpine

COPY ../.. /bot

WORKDIR /bot
RUN npm install

WORKDIR /bot/src
CMD ["node", "main.js"]
