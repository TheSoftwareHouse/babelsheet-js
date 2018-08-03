import * as dotenv from 'dotenv';
import * as yargs from 'yargs';
import { Options } from 'yargs';
import { ILogger } from 'node-common';
import createContainer from './container';
import Formatter from './formater';
import GoogleSheets from '../../shared/google/sheets';

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
  const fOptions: Options = {
    alias: 'format',
    default: 'json',
    describe: 'Format to export',
    type: 'string',
  };
  const argv = yargs.usage('Usage: $0 generate [-f "format"]').option('f', fOptions).argv;

  const spreadsheetData = await container.resolve<GoogleSheets>('googleSheets').fetchSpreadsheet();

  container.resolve<Formatter>('formatter').format(argv.f);
}

main();
