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
    spreadsheetName: BABELSHEET_SPREADSHEET_NAME,
    redirectUri: BABELSHEET_REDIRECT_URI || 'http://localhost:3000/oauth2callback',
  };

  checkAuthParameters(authData);
  return authData as { [key: string]: string };
}

async function main() {
  const authData = getAuthDataFromEnv();
  const spreadsheetData = await container.resolve<GoogleSheets>('googleSheets').fetchSpreadsheet(authData);

  const transformer = container.resolve<ITransformer>('transformer');
  const transformedSheets: { [key: string]: any } = await Object.keys(spreadsheetData).reduce(
    async (transformedTranslationsPromise: Promise<{ [key: string]: any }>, key) => {
      const values = spreadsheetData[key];

      if (!values) {
        return transformedTranslationsPromise;
      }

      const data = await transformer.transform(spreadsheetData[key]);
      const transformedTranslations = await transformedTranslationsPromise;

      transformedTranslations[key] = data;

      return transformedTranslationsPromise;
    },
    Promise.resolve({})
  );

  const translationsStorage = container.resolve<TranslationsStorage>('translationsStorage');
  const logger = container.resolve<ILogger>('logger');

  Object.keys(transformedSheets).forEach(async key => {
    const [, actualTranslations] = await to(translationsStorage.getTranslations([], key));

    if (!ramda.equals(transformedSheets[key], actualTranslations)) {
      await translationsStorage.clearTranslations(key);
      await translationsStorage.setTranslations([], transformedSheets[key], key);

      logger.info(`Translations (version ${key}) were refreshed`);
    }
  });
}

const everyFiveMinutes = '*/5 * * * *';

main();
schedule.scheduleJob(everyFiveMinutes, () => {
  main();
});
