import to from 'await-to-js';
import * as dotenv from 'dotenv';
import * as schedule from 'node-schedule';
import * as ramda from 'ramda';
import { ILogger } from 'tsh-node-common';
import { checkAuthParameters } from '../../shared/checkAuthParams';
import GoogleSheets from '../../shared/google/sheets';
import ITransformer from '../../shared/transformers/transformer';
import TranslationsStorage from '../../shared/translations/translations';
import createContainer from './container';

dotenv.config();

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
  const { CLIENT_ID, CLIENT_SECRET, SPREADSHEET_ID, SPREADSHEET_NAME, REDIRECT_URI } = process.env;
  const authData = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    spreadsheetId: SPREADSHEET_ID,
    spreadsheetName: SPREADSHEET_NAME || 'Sheet1',
    redirectUri: REDIRECT_URI || 'http://localhost:3000/oauth2callback',
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
