FROM node:22

WORKDIR /bot

COPY . .

RUN npm install

WORKDIR /bot/src
CMD ["node", "main.js"]
