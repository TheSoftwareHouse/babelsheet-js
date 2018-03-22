FROM node:9.9.0

WORKDIR /app
ADD . /app

RUN npm i
RUN npm run build

EXPOSE 3000

CMD node build/index.js
