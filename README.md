# Babelsheet node

Babelsheet node service allows you to translate all of the UI / app content to specific language. As a user interface we use google spreadsheets and translations are synchronised every 5 minutes (this might be changed easily in order to make it configurable). This service contains a scheduler to synchronise translations, but also an web server allowing you to fetch them. What's more there is a cache layer for better performance.

## Setup

1. Create `.env` from `.env.dist` file with all required environment variables (see other sections)
2. Create `docker-compose.yml` from `docker-compose.yml.dist`
3. Run `npm i`
4. Install pm2 with `npm i -g pm2`
5. Run redis with `docker-compose up -d redis`
6. Run producer with `pm2 start src/services/producer/index.ts`
7. Run api with `pm2 start src/services/api/index.ts`

For now services do not have proper docker files. If you want to run it on production, contact your devops.

## Storage implementations

Service is implemented to use redis as cache storage but can use another database or even in memory cache as well. There are various implementations in `src/infrastracture/storage`. For fast production use it is recommended to use redis, but for local development and debugging in memory implementation can be used. There are some other implementations available now, like `in file` and as `environment variables`. In order to change used storage all you need is to find proper `container.ts` file in one of used services (directory `src/services`) and change the implementation injected in dependency injection container, for example:

```
import InRedisStorage from '../../infrastructure/storage/in-redis';
   
container.register({
  storage: awilix.asClass(InRedisStorage)
});
```

## Scripts

```
npm run test - runs tests and generates coverage report
npm run test-watch - runs tests continuously and watches for changes
npm run format - formats code using prettier
npm run type-check - runs typescript checks
npm run build - compiles typescript
npm run lint - runs typescript linter
npm run lint-fix - runs typescript linter and fixes some common mistakes
npm run nsp - runs security check
```

## Usage

```
curl -X GET -g 'http://localhost:3000/translations'
curl -X GET -g 'http://localhost:3000/translations?filters[]=en_US.CORE'
```

## Environment Variables

```
CLIENT_ID=
CLIENT_SECRET=
REDIRECT_URI=http://localhost:3000/oauth2callback
token={"access_token":"","refresh_token":""}
REDIS_HOST=localhost
REDIS_PORT=6379
SPREADSHEET_ID=
SPREADSHEET_NAME=
HOST=localhost
PORT=3000
NODE_ENV=dev
APP_NAME=babelsheet-node
LOGGING_LEVEL=debug
TRACING_SERVICE_HOST=localhost
TRACING_SERVICE_PORT=6832
```

## Available services

### Producer
Producer is used to fetch translations file, convert it and then store it in a database. The process is wrapped in a scheduler which repeats the whole operation continuously every 5 minutes. Please note that if there are no proper environment variables such as `CLIENT_ID`, `CLIENT_SECRET` and `token` then producer is not able to work properly. In such case it runs a command responsible for obtaining those keys.

### API
API is a web server built on top of `express.js` which serves translations. There is one endpoint available to obtain translations, which is `/translations`, but they can be also filtered by using query param filter, e.g. calling `/translations?filters[]=en_US.CORE` will result in getting translations for `en_US` locale and section `CORE`. Other possibility is to use tag as a filter, e.g. `/translations?filters[]=en_US.tag1`. Translations are served in json format and the structure is preserved regardless of filters being used.

## Spreadsheet metadata

Spreadsheet metadata contains symbols:

- `###` - determines column with optional tags, each tag describes whole row, there might be more tags per row and they should be separated by a comma
- `>>>` - determines column with translation key, there might be more such columns placed one after another, each column makes another key which is nested, e.g. `CORE.LABELS` or `FRONT.HEADER.TITLE`.
- locale, e.g. `en_US`, `pl_PL` and others - determines column with translations for specific locale

## Configuring translations service with Google Spreadsheet API

1. Create account in Google Cloud Platform
2. Create a project in Google Cloud Platform and enable Google Sheets API usage (section API & Services dashboard)
3. Go to section API & Services Credentials, then OAuth consent screen and fill in the form with proper product name, e-mail address.
4. In API & Services Credentials add new credentials and choose OAuth client, then choose Other as a type and provide its name.
5. You will be given Client ID and Client secret keys, use them in environment variables `CLIENT_ID` and `CLIENT_SECRET` in `.env` file.
6. By default tokens use mixed storage in memory and environment variables. They are read from environment variables and in case of refreshing them they are stored in memory for later use. This configuration is working well when tokens are obtained already and access token is refreshed sometimes by a refresh token. But when you want to get token for the very first time, you should change tokens storage.
7. Go to file `src/services/producer/container.ts` and use in file storage this way:

```
import InFileStorage from '../../infrastructure/storage/in-file';
   
container.register({
    inFileStorage: awilix.asClass(InFileStorage, { lifetime: awilix.Lifetime.SINGLETON }),
    tokenStorage: awilix
      .asClass(TokenStorage)
      .inject(() => ({ storage: container.resolve<InFileStorage>('inFileStorage') })),
  });
```

8. Additionally, create file `data.json` in project main repository and set its content to `{"token": {"access_token":""}}`.
9. Now you can run Translations producer, it will check if access and refresh tokens are available - they are not so it will go through the process of obtaining them. To run producer you can use command `ts-node src/services/producer/index.ts`. Please note that by default producer is executed every 5 minutes and it is not configurable yet. You can wait or change that parameter in file provided in a command.

From:

```
const everyFiveMinutes = '*/5 * * * *';
 
schedule.scheduleJob(everyFiveMinutes, () => {
  main();
});
```

To just:

```
main();
```

10. Browser window will be opened automatically. Log in into you Google account and then grant your application an access for reading spreadsheets in your account. You should be given a message `Authentication successful! Please return to the console.`.
11. Tokens are now stored in file `data.json` and will be used for API calls. You can move them to your `.env` file and revert changes in `index.ts` and `container.ts`.
12. More actions won't be needed because tokens will be refreshed automatically if necessary.
