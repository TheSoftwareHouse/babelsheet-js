## docker-compose

To proprely run API, you need to run redis storage and producer as well. It can be runned by docker-compose. First create `docker-compose.yml` file and paste in:

```
version: '3'
services:
  babelsheet-api:
    image: tsh/babelsheet-api
    env_file:
      - .env
    ports:
      - "3000:3000"
    depends_on:
      - redis
  babelsheet-producer:
    image: tsh/babelsheet-producer
    env_file:
      - .env
    depends_on:
      - redis
  redis:
    image: redis
    ports:
      - "6379:6379"
```

Next, make sure you have proper [.env file](/../configuration#configuration-file) in the same directory, then run `docker-compose up`, and API should be working now.

## Redis
  To run redis as a docker container type
  `docker run --name redis -p 6379:6379 redis`

  Or run it from [docker-compose.yml file](#docker-compose) by following command:

  `docker-compose up redis`

## Producer
  To run producer from [docker-compose.yml file](#docker-compose) run following command:

  `docker-compose up babelsheet-producer`

## API
  To run API from [docker-compose.yml file](#docker-compose) run following command:

  `docker-compose up babelsheet-api`
