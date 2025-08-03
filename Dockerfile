# FROM node:22

# WORKDIR /bot

# COPY . .

# RUN npm install

# CMD cd src && node main
# #CMD cd commands_management && node deploy-commands-globally

FROM node:22

WORKDIR /bot

COPY . .

RUN npm install

WORKDIR /bot/src
CMD ["node", "main.js"]