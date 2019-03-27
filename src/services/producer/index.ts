#!/usr/bin/env node
import * as dotenv from 'dotenv';
import { ConfigProviderFactory } from './../cli/spreadsheet-config-providers/config-provider.factory';

const BABELSHEET_ENV_PATH = '.env.babelsheet';
dotenv.config();
dotenv.config({ path: BABELSHEET_ENV_PATH });

import * as schedule from 'node-schedule';
import { ILogger } from 'tsh-node-common';
import { SheetsProviderFactory } from '../../shared/sheets-provider/sheets-provider.factory';
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

async function main() {
  const spreadsheetSource = process.env.BABELSHEET_SPREADSHEET_SOURCE || 'google';

  const configProvider = container
    .resolve<ConfigProviderFactory>('configProviderFactory')
    .getProviderFor(spreadsheetSource);
  const sheetsProvider = container
    .resolve<SheetsProviderFactory>('sheetsProviderFactory')
    .getProviderFor(spreadsheetSource);

  const authData = configProvider.getSpreadsheetConfig({});
  await container.resolve<TranslationsProducer>('translationsProducer').produce(authData, sheetsProvider);
}

const everyFiveMinutes = '*/5 * * * *';

main();
schedule.scheduleJob(everyFiveMinutes, () => {
  main();
});
