import * as dotenv from 'dotenv';
import { ILogger } from 'node-common';
import * as yargs from 'yargs';
import { Arguments } from 'yargs';
import IFileRepository from '../../infrastructure/repository/file-repository.types';
import { Permission } from '../../infrastructure/repository/file-repository.types';
import GoogleSheets from '../../shared/google/sheets';
import createContainer from './container';
import { formatExists, getExtension } from './formatToExtensions';
import Transformers from './transformers';

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

function configureCli(): Arguments {
  return yargs
    .usage('Usage: generate [-f "format"] [-n "filename"] [-p "path"]')
    .command('generate', 'Generate file with translations')
    .required(1, 'generate')
    .option('f', { alias: 'format', default: 'json', describe: 'Format type', type: 'string' })
    .option('p', { alias: 'path', default: '.', describe: 'Path for file save', type: 'string' })
    .option('n', {
      alias: 'filename',
      default: 'translations',
      describe: 'Filename of result file',
      type: 'string',
    })
    .help('?')
    .alias('?', 'help')
    .example('$0 generate -f xml -n my-data -p ./result', 'Generate my-data.xml in folder /result')
    .example('$0 generate -n my-data', 'Generate file with result in json extension').argv;
}

function checkOptions(format: string, path: string): void {
  const { info, error } = container.resolve<ILogger>('logger');

  info('Checking formats...');
  const formatExsits = formatExists(format);

  if (!formatExsits) {
    error(`Not possible to create translations for format '${format}'`);
    process.exit(1);
  }

  info('Checking folder permissions...');
  const canWrite = container.resolve<IFileRepository>('fileRepository').hasAccess(path, Permission.Write);

  if (!canWrite) {
    error(`No access to '${path}'`);
    process.exit(1);
  }
}

async function main() {
  const { info, error } = container.resolve<ILogger>('logger');
  const args = configureCli();
  checkOptions(args.format, args.path);

  info('Fetching spreadsheet...');
  const spreadsheetData = await container.resolve<GoogleSheets>('googleSheets').fetchSpreadsheet();
  info('Spreadsheet fetched successfully.');

  info('Formatting spreadsheet...');

  let dataToSave;
  try {
    dataToSave = await container.resolve<Transformers>('transformers').transform(spreadsheetData, args.format);
  } catch (err) {
    error(err.message);
    process.exit(1);
  }

  info('Spreadsheet formatted.');

  info(`Saving file to ${args.path}/${args.filename}.${args.format}`);
  const extension = getExtension(args.format);
  container.resolve<IFileRepository>('fileRepository').saveData(dataToSave, args.filename, extension, args.path);
  info('File successfully saved.');
}

main();
