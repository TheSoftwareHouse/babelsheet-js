#!/usr/bin/env node
import * as dotenv from 'dotenv';

const BABELSHEET_ENV_PATH = '.env.babelsheet';
dotenv.config();
dotenv.config({ path: BABELSHEET_ENV_PATH });

import to from 'await-to-js';
import * as schedule from 'node-schedule';
import * as ramda from 'ramda';
import { ILogger } from 'tsh-node-common';
import { checkAuthParameters } from '../../shared/checkAuthParams';
import GoogleSheets from '../../shared/google/sheets';
import ITransformer from '../../shared/transformers/transformer';
import TranslationsStorage from '../../shared/translations/translations';
import createContainer from './container';

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
    BABELSHEET_SPREADSHEET_NAME,
    BABELSHEET_REDIRECT_URI,
  } = process.env;

  const authData = {
    clientId: BABELSHEET_CLIENT_ID,
    clientSecret: BABELSHEET_CLIENT_SECRET,
    spreadsheetId: BABELSHEET_SPREADSHEET_ID,
    spreadsheetName: BABELSHEET_SPREADSHEET_NAME || 'Sheet1',
    redirectUri: BABELSHEET_REDIRECT_URI || 'http://localhost:3000/oauth2callback',
  };

  checkAuthParameters(authData);
  return authData as { [key: string]: string };
}

async function main() {
  const authData = getAuthDataFromEnv();
  const spreadsheetData = await container.resolve<GoogleSheets>('googleSheets').fetchSpreadsheet(authData);

  const transformedData = await container.resolve<ITransformer>('transformer').transform(spreadsheetData);

  const [, actualTranslations] = await to(
    container.resolve<TranslationsStorage>('translationsStorage').getTranslations([])
  );

  if (!ramda.equals(transformedData, actualTranslations)) {
    await container.resolve<TranslationsStorage>('translationsStorage').clearTranslations();
    await container.resolve<TranslationsStorage>('translationsStorage').setTranslations([], transformedData);

    container.resolve<ILogger>('logger').info('Translations were refreshed');
  }
}

const everyFiveMinutes = '*/5 * * * *';

main();
schedule.scheduleJob(everyFiveMinutes, () => {
  main();
});
