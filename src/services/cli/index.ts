import * as dotenv from 'dotenv';
import * as yargs from 'yargs';
import { Arguments } from 'yargs';
import { ILogger } from 'node-common';
import createContainer from './container';
import Formatter from './formater';
import GoogleSheets from '../../shared/google/sheets';
import IFileRepository from '../../infrastructure/repository/file-repository.types';

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
    .option('n', { alias: 'filename', default: 'data', describe: 'Filename of result file', type: 'string' })
    .option('p', { alias: 'path', default: '.', describe: 'Path for file save', type: 'string' })
    .help('?')
    .alias('?', 'help')
    .example('$0 generate -f xml -n my-data -p ./result', 'Generate my-data.xml in folder /result')
    .example('$0 generate -n my-data', 'Get file with result in json extension').argv;
}

async function main() {
  const args = configureCli();

  const spreadsheetData = await container.resolve<GoogleSheets>('googleSheets').fetchSpreadsheet();

  const transformedData = await container.resolve<Formatter>('formatter').format(spreadsheetData, args.format);

  container
    .resolve<IFileRepository>('fileRepository')
    .saveData(JSON.stringify(transformedData), args.filename, args.format);

  process.exit(0);
}

main();
