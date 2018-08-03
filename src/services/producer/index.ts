import to from 'await-to-js';
import * as dotenv from 'dotenv';
import { ILogger } from 'node-common';
import * as schedule from 'node-schedule';
import * as ramda from 'ramda';
import TranslationsStorage from '../../shared/translations/translations';
import createContainer from './container';
import GoogleSheets from '../../shared/google/sheets';
import ITransformer from './transformer/transformer';

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

async function main() {
  const spreadsheetData = await container.resolve<GoogleSheets>('googleSheets').fetchSpreadsheet();

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

schedule.scheduleJob(everyFiveMinutes, () => {
  main();
});
