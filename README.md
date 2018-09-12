# Babelsheet

Babelsheet node service allows you to translate all of the UI / app content to specific language. As a user interface we use google spreadsheets and translations are synchronised every 5 minutes. This service contains a scheduler to synchronise translations, a web server allowing you to fetch them, and a CLI tools which can generate translations in various formats. What's more there is a cache layer for better performance. Babelsheet supports formats:

- iOS
- Android
- json
- yml

No more dealing with complicated paid translation services or problems with multiple users working at the same time!

## Setup

### CLI
1. Create `.env` from `.env.dist` file with required environment variables ([more info here](https://thesoftwarehouse.github.io/babelsheet-js/configuration#configuration-file))
2. Run `npm i -g babelsheet`
3. 'babelsheet generate' ([more info here](https://thesoftwarehouse.github.io/babelsheet-js/services#cli))


### Docker
1. Create `.env` from `.env.dist` file with required environment variables ([more info here](https://thesoftwarehouse.github.io/babelsheet-js/configuration#configuration-file))
2. Create `docker-compose.yml` from `docker-compose.yml.dist` ([more info here](https://thesoftwarehouse.github.io/babelsheet-js/docker#docker-compose))
3. `docker-compose up`


## Example usage

### CLI

`babelsheet generate --format ios --path ./translations` - generates translations in iOS format in `./translations` folder.

### API

`curl -X GET -g 'http://localhost:3000/translations?filters[]=en_US.CORE.LABELS&format=android'` - endpoint which returns filtered translations in android format
