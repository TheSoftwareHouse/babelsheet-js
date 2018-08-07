import * as dotenv from 'dotenv';
import { ILogger } from 'node-common';
import * as yargs from 'yargs';
import { Arguments } from 'yargs';
import IFileRepository from '../../infrastructure/repository/file-repository.types';
import { Permission } from '../../infrastructure/repository/file-repository.types';
import GoogleSheets from '../../shared/google/sheets';
import createContainer from './container';
import { doesFormatExists } from './formatToExtensions';
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
    .command('generate', 'Generate the file')
    .required(1, 'generate')
    .option('f', { alias: 'format', default: 'json', describe: 'Format to export', type: 'string' })
    .option('n', {
      alias: 'filename',
      default: 'translations',
      describe: 'Filename of result file',
      type: 'string',
    })
    .option('p', { alias: 'path', default: '.', describe: 'Path for file save', type: 'string' })
    .help('?')
    .alias('?', 'help')
    .example('$0 generate -f xml -n my-data -p ./result', 'Generate my-data.xml in folder /result')
    .example('$0 generate -n my-data', 'Get file with result in json extension').argv;
}

async function main() {
  const args = configureCli();
  const { info, error } = container.resolve<ILogger>('logger');

  info('Checking formats...');
  const formatExsits = doesFormatExists(args.format);

  if (!formatExsits) {
    error(`Not possible to create translations for format '${args.format}'`);
    process.exit(1);
  }

  info('Checking folder permissions...');
  const canWrite = container.resolve<IFileRepository>('fileRepository').hasAccess(args.path, Permission.Write);

  if (!canWrite) {
    error(`No access to '${args.path}'`);
    process.exit(1);
  }

  info('Fetching spreadsheet...');
  const spreadsheetData = await container.resolve<GoogleSheets>('googleSheets').fetchSpreadsheet();
  info('Spreadsheet successfully fetched.');

  info('Formatting spreadsheet...');

  let dataToSave;
  try {
    dataToSave = await container.resolve<Transformers>('transformers').transform(spreadsheetData, args.format);
  } catch (error) {
    error(error.message);
  }

  info('Spreadsheet formatted.');

  info(`Saving file to ${args.path}/${args.file}.${args.format}`);
  container.resolve<IFileRepository>('fileRepository').saveData(dataToSave, args.filename, args.format, args.path);
  info('File successfully saved.');

  process.exit(0);
}

main();
