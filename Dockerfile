FROM alpine

RUN apk add --update nodejs npm

RUN mkdir -p /home/piazza/node_modules

WORKDIR /home/piazza

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000


CMD [ "node", "app.js" ]