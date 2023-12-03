FROM node:20.8-alpine3.18

RUN mkdir -p /home/piazza/app/node_modules && chown -R piazza:piazza /home/piazza/app

WORKDIR /home/piazza/app

COPY --chown=node:node package*.json ./

USER piazza

RUN npm install

COPY --chown=piazza:piazza . .

EXPOSE 3000

CMD [ "node", "app.js" ]