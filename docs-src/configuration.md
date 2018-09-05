In order to start using babelsheet, you have to configure your `.env` file first.

## Configuration file

```
CLIENT_ID=<GOOGLE-CLIENT-ID>
CLIENT_SECRET=<GOOGLE-CLIENT-SECRET>
SPREADSHEET_ID=<SPREADSHEET-ID>
SPREADSHEET_NAME=<SPREADSHEET-NAME>
REFRESH_TOKEN=<REFRESH-TOKEN>

REDIRECT_URI=http://localhost:3000/oauth2callback
REDIS_HOST=redis
REDIS_PORT=6379
HOST=localhost
PORT=3000
NODE_ENV=dev
APP_NAME=babelsheet-node
LOGGING_LEVEL=debug
TRACING_SERVICE_HOST=localhost
TRACING_SERVICE_PORT=6832
```

### Configuration options
`CLIENT_ID`* - client id received from Google ([see how to config](#configuring-google-spreadsheet-api))

`CLIENT_SECRET`* - client secret received from Google ([see how to config](#configuring-google-spreadsheet-api))

`SPREADSHEET_ID`* - spreadsheet ID from spreadsheet URL
<details>
  <summary id="how-to-get-spreadsheet-id">How to get spreadsheet ID</summary>
  <p>
    Spreadsheet ID can be taken from spreadsheet url. It's the part after `/d/` sign:
    `https://docs.google.com/spreadsheets/d/<spreadsheet-id>/`
  </p>
</details>

`SPREADSHEET_NAME`* - sheet name
<details>
  <summary id="how-to-get-spreadsheet-name">How to get spreadsheet name</summary>
  <p>
    Spreadsheet name is the name of the tab in spreadsheet document.
    ![Screenshot](img/spreadsheet-name.png)
  </p>
</details>

`REFRESH_TOKEN`* - refresh token ([see how to obtain](#generating-refresh-token))

`REDIRECT_URI` - url to which user should be redirected after receiving refresh token

`REDIS_HOST` - host name of redis store

`REDIS_PORT` - port of redis store

`HOST` - host name for winston

`PORT` - API port

`NODE_ENV` - environment type

`APP_NAME` - name which indentify app

`LOGGING_LEVEL` - Log level debug/error/info

`TRACING_SERVICE_HOST` - Server open tracing host / jaeger server

`TRACING_SERVICE_PORT` - Server open tracing port / jaeger server

<small>* - required</small>


## Configuring Google Spreadsheet API

1. Create account in Google Cloud Platform
2. Create a project in Google Cloud Platform and enable Google Sheets API usage (section API & Services dashboard)
3. Go to section API & Services Credentials, then OAuth consent screen and fill in the form with proper product name, e-mail address.
4. In API & Services Credentials add new credentials and choose OAuth client, then choose Other as a type and provide its name.
5. You will be given Client ID and Client secret keys, use them in environment variables `CLIENT_ID` and `CLIENT_SECRET` in `.env` file.


## Generating refresh token

1. To generate refresh token, you have to [configure Google Spreadsheet API](#configuring-google-spreadsheet-api) first.
2. When `CLIENT_ID` and `CLIENT_SECRET` are stored in `.env` file, you are ready to generate refresh-token.
3. Run `babelsheet generate --config`.


    <small>If babelsheet is not installed, run `npm i -g babelsheet` to install.</small>
    <details>
      <summary>CLIENT_ID and CLIENT_SECRET as params</summary>
      <p>
        You don't have to create .env file, you can pass CLIENT_ID and CLIENT_SECRET values as parameters to babelsheet:
        `npm generate --config --client_id <yours-client-id> --client_secret <yours-client-secret>`
      </p>
    </details>
    <details>
      <summary>Config in json file</summary>
      <p>
        You can also generate token in `data.json` file, just by passing `json` parameter option `npm generate --config json`.
      </p>
    </details>


4. Browser window will be opened automatically. Log in into you Google account and then grant your application an access for reading spreadsheets in your account. You should be given a message `Authentication successful! Please return to the console`.
5. Refresh token is now stored in `.env` file. You can change storage type [here](development.md#set-refresh-token-write-provider).
6. More actions won't be needed because tokens will be refreshed automatically if necessary.

