FROM node:10

WORKDIR /app

COPY package.json .

RUN npm i --production

COPY . /app

EXPOSE 3000

CMD npm run start-api
