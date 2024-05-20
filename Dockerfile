FROM node:20

WORKDIR /bot

COPY . .

RUN npm install

CMD cd src && node main
#CMD cd commands_management && node deploy-commands-globally
