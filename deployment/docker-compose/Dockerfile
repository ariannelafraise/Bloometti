FROM node:24

COPY . /bot

WORKDIR /bot
RUN npm install

WORKDIR /bot/src
CMD ["node", "main.js"]
