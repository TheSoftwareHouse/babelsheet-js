## CLI
Command line tool is used to obtain `REFRESH_TOKEN`, as well as to generate translations files.
Translations files are possible to generate in given formats:

- Android
- iOS
- JSON

To run command line tools, you need to install it first:

`npm i -g babelsheet`


If you want to obtain `REFRESH_TOKEN` then see [Generating refresh token](/../configuration#generating-refresh-token)

### Generating translations files

To generate translations type:

`babelsheet generate [options]`

**Options**
<details>
  <summary>--format</summary>
  <p>
    (alias: <code>-f</code>)
  </p>
  <p>
    (default: <code>json</code>)
  </p>
  <p>
    Format type (android/ios/json).
  </p>
</details>
<details>
  <summary>--path</summary>
  <p>
    (alias: <code>-p</code>)
  </p>
  <p>
    (default: <code>.</code>)
  </p>
  <p>
    Path for saving files.
  </p>
</details>
<details>
  <summary>--language</summary>
  <p>
    (alias: <code>-l</code>)
  </p>
  <p>
    Language code for generating translations only in given language.
  </p>
</details>
<details>
  <summary>--filename</summary>
  <p>
    (alias: <code>-n</code>)
  </p>
  <p>
    (default: <code>translations</code>)
  </p>
  <p>
    Filename of final translati3on file.
  </p>
</details>
<details>
  <summary>--base</summary>
  <p>
    (default: <code>EN</code>)
  </p>
  <p>
    Base language for translations, `Base.lproj` folder on iOS format and `values` folder on android format.
  </p>
</details>
<details>
  <summary>--merge</summary>
  <p>
    Creates one file with all languages.
  </p>
</details>
<details>
  <summary>--client_id</summary>
  <p>
    Client id received from Google. Overwrite .env `CLIENT_ID` value.
  </p>
</details>
<details>
  <summary>--client_secret</summary>
  <p>
    Client secret received from Google. Overwrite .env `CLIENT_SECRET` value.
  </p>
</details>
<details>
  <summary>--spreadsheet_id</summary>
  <p>
    Spreadsheet ID from spreadsheet URL. Overwrite .env `SPREADSHEET_ID` value. ([see how to obtain](/../configuration#how-to-get-spreadsheet-id)).
  </p>
</details>
<details>
  <summary>--spreadsheet_name</summary>
  <p>
    Sheet name. Overwrite .env `SPREADSHEET_NAME` value. ([see how to obtain](/../configuration#how-to-get-spreadsheet-name)).
  </p>
</details>
<details>
  <summary>--spreadsheet_name</summary>
  <p>
    Url to which user should be redirected after receiving refresh token. Overwrite .env `REDIRECT_URI` value. ([see how to obtain](/../configuration/#how-to-get-spreadsheet-name)).
  </p>
</details>
<details>
  <summary>--help</summary>
  <p>
    Help menu.
  </p>
</details>

**Examples**

`babelsheet generate -f json -n my-own-en-translations -l en_US -p ./my-folder` - generates english translations in my-own-en-translations.json file inside ./my-folder folder.

`babelsheet generate --format ios --path ./translations` - generates translations in iOS format in translations folder.


## Producer
Producer is used to fetch translations file, convert it and then store it in a database. The process is wrapped in a scheduler which repeats the whole operation continuously every 5 minutes. Please note that if there are no proper environment variables such as `CLIENT_ID`, `CLIENT_SECRET` and `REFRESH_TOKEN` then producer is not able to work properly. In such case it runs a command responsible for obtaining those keys.

You can run Producer in docker container - see [Docker](/../docker).

If you want to run producer locally, first remember about [setting environment variables](/../configuration#configuration-file) and [running redis](/../docker#redis), next type:

1. `npm run dev-install`

2. `npm run dev-start-producer`

Producer should be working now.

## API
API is a web server built on top of `express.js` which serves translations. There is one endpoint available to obtain translations, which is `/translations`, but they can be also filtered by using query param filter, e.g. calling `/translations?filters[]=en_US.CORE` will result in getting translations for `en_US` locale and section `CORE`. Other possibility is to use tag as a filter, e.g. `/translations?filters[]=en_US.tag1`. Translations are served in json format and the structure is preserved regardless of filters being used.

You can run API in docker container - see [Docker](/../docker#).

If you want to run API locally, first remember about [setting environment variables](/../configuration#configuration-file) and [running redis](/../docker#redis), next type:

1. `npm run dev-install`

2. `npm run dev-start-api`

API should be working now.
