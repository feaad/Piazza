FROM alpine

RUN adduser -D -g '' piazza_user

RUN apk add --update nodejs npm

RUN mkdir -p /home/piazza/node_modules

RUN chown -R piazza_user:piazza_user /home/piazza

WORKDIR /home/piazza

COPY --chown=piazza_user:piazza_user package*.json ./

RUN npm install

COPY --chown=piazza_user:piazza_user . .

EXPOSE 3000

CMD [ "node", "app.js" ]