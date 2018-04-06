FROM node:9.9.0

WORKDIR /app
ADD . /app

RUN npm i
RUN npm run build

CMD node build/producer/index.js
