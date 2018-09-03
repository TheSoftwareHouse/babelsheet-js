## About Babelsheet

Babelsheet node service allows you to translate all of the UI / app content to specific language. As a user interface we use google spreadsheets and translations are synchronised every 5 minutes. This service contains a scheduler to synchronise translations, a web server allowing you to fetch them, and a CLI tools which can generate translations in various formats. What's more there is a cache layer for better performance.

No more dealing with complicated paid translation services or problems with multiple users working at the same time!


## To run CLI

1. Create [configuration file](/../configuration#configuration-file).
2. `npm i -g babelsheet`
3. `babelsheet generate`

## To run as API

1. Create [configuration file](/../configuration#configuration-file).
2. Create [docker-compose.yml](/../docker#docker-compose).
3. `docker-compose up`
