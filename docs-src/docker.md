## docker-compose

To proprely run API, you need to run redis storage and producer as well. It can be runned by docker-compose. First create `docker-compose.yml` file and paste in:

```
version: '3'
services:
  babelsheet-api:
    image: tsh/babelsheet-api
    env_file:
      - .env
      - .env.babelsheet
    ports:
      - "3000:3000"
    depends_on:
      - redis
  babelsheet-producer:
    image: tsh/babelsheet-producer
    env_file:
      - .env
      - .env.babelsheet
    depends_on:
      - redis
  redis:
    image: redis
    ports:
      - "6379:6379"
```

Next, make sure you have proper [.env.babelsheet](configuration.md#configuration-file) file in the same directory, then run `docker-compose up`, and API should be working now.

## Redis
  To run redis as a docker container type
  `docker run --name redis -p 6379:6379 redis`

  Or run it from [docker-compose.yml](#docker-compose) file by following command:

  `docker-compose up redis`

## Producer
  To run producer from [docker-compose.yml](#docker-compose) file run following command:

  `docker-compose up babelsheet-producer`

## API
  To run API from [docker-compose.yml](#docker-compose) file run following command:

  `docker-compose up babelsheet-api`
