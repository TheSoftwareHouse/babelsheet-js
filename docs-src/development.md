## Set refresh token read providers
You can set order of `REFRESH_TOKEN` providers in `/src/services/producer/container.ts` for producer, and in `/src/services/cli/container.ts` for CLI tool:

```
  readProviders: [
    container.resolve<InEnvStorage>('inEnvStorage'),
    container.resolve<InFileStorage>('inFileStorage'),
    container.resolve<InRedisStorage>('inRedisStorage'),
  ],
```
First .env file will be checked does it contain `REFRESH_TOKEN`, if not, next `data.json` file will be checked, and the last one will be redis storage. Feel free to change order of those providers, or creating new ones.


## Set refresh token write provider
You can set `REFRESH_TOKEN` write provider in `/src/services/cli/container.ts` for CLI tool, and in `/src/services/producer/container.ts` for producer. Notice that producer will only have ability to save `REFRESH_TOKEN` when you run it locally, not in docker container - browser window will be opened automatically.

`writeProvider: container.resolve<InEnvStorage>('inEnvStorage'),`

You can change it to one of those three storages:

`container.resolve<InEnvStorage>('inEnvStorage')`

`container.resolve<InFileStorage>('inFileStorage')`

`container.resolve<InRedisStorage>('inRedisStorage')`

Feel free to add new providers.


## Change translations storage from redis to file
By default, translations as saved in redis storage. In order to change translations storage to file.

1. Open `/src/services/producer/container.ts` and change:

    `storage: awilix.asClass(InRedisStorage)` to:

    ```
    storage: awilix.asClass(InFileStorage)
    ```

2. Open `/src/services/api/container.ts` and change:

    `storage: awilix.asClass(InFileStorage)` to:

    ```
    fileRepository: awilix.asClass(FileRepository, { lifetime: awilix.Lifetime.SINGLETON }),
    storage: awilix.asClass(InFileStorage)
    ```

Producer will now save to `data.json` file, and API will read from that file as well.
