#!/usr/bin/env node
import * as dotenv from 'dotenv';

const BABELSHEET_ENV_PATH = '.env.babelsheet';
dotenv.config();
dotenv.config({ path: BABELSHEET_ENV_PATH });

import * as schedule from 'node-schedule';
import { ILogger } from 'tsh-node-common';
import { checkAuthParameters } from '../../shared/checkAuthParams';
import createContainer from './container';
import TranslationsProducer from './translations-producer/translations-producer';

const container = createContainer();

process.on('uncaughtException', err => {
  container.resolve<ILogger>('logger').error(err.toString());
  process.exit(1);
});

process.on('unhandledRejection', err => {
  container.resolve<ILogger>('logger').error(err.toString());
  process.exit(1);
});

function getAuthDataFromEnv(): { [key: string]: string } {
  const {
    BABELSHEET_CLIENT_ID,
    BABELSHEET_CLIENT_SECRET,
    BABELSHEET_SPREADSHEET_ID,
    // BABELSHEET_SPREADSHEET_NAME,
    BABELSHEET_REDIRECT_URI,
  } = process.env;

  const authData = {
    clientId: BABELSHEET_CLIENT_ID,
    clientSecret: BABELSHEET_CLIENT_SECRET,
    spreadsheetId: BABELSHEET_SPREADSHEET_ID,
    spreadsheetName: '', //BABELSHEET_SPREADSHEET_NAME,
    redirectUri: BABELSHEET_REDIRECT_URI || 'http://localhost:3000/oauth2callback',
  };

  checkAuthParameters(authData);
  return authData as { [key: string]: string };
}

async function main() {
  const authData = getAuthDataFromEnv();
  await container.resolve<TranslationsProducer>('translationsProducer').produce(authData);
}

const everyFiveMinutes = '*/5 * * * *';

main();
schedule.scheduleJob(everyFiveMinutes, () => {
  main();
});
