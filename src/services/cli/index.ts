#!/usr/bin/env node

import * as dotenv from 'dotenv';
import { ILogger } from 'node-common';
import * as yargs from 'yargs';
import { Arguments } from 'yargs';
import IFileRepository from '../../infrastructure/repository/file-repository.types';
import { Permission } from '../../infrastructure/repository/file-repository.types';
import { checkAuthParameters } from '../../shared/checkAuthParams';
import { getExtension } from '../../shared/formatToExtensions';
import GoogleSheets from '../../shared/google/sheets';
import Transformers from '../../shared/transformers/transformers';
import createContainer from './container';
import FilesCreators from './files-creators/files-creators';

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
    .option('l', {
      alias: 'language',
      describe: 'Language code for generating translations file only in given language',
      type: 'string',
    })
    .option('n', {
      alias: 'filename',
      default: 'translations',
      describe: 'Filename of result file',
      type: 'string',
    })
    .option('merge', { default: 'false', describe: 'Create one file with all languages', type: 'boolean' })
    .option('client_id', { describe: 'Client ID', type: 'string' })
    .option('client_secret', { describe: 'Client secret', type: 'string' })
    .option('spreadsheet_id', { describe: 'Spreadsheet ID', type: 'string' })
    .option('spreadsheet_name', { describe: 'Spreadsheet name', type: 'string' })
    .option('redirect_uri', { describe: 'The URI to redirect after completing the auth request' })
    .help('?')
    .alias('?', 'help')
    .example(
      '$0 generate -f xml -n my-data -p ./result -l en_US',
      'Generate my-data.xml with english translations in folder /result'
    )
    .example('$0 generate -n my-data', 'Generate file with result in json extension').argv;
}

function checkFolderPermissions(path: string): void {
  const { error } = container.resolve<ILogger>('logger');

  const canWrite = container.resolve<IFileRepository>('fileRepository').hasAccess(path, Permission.Write);

  if (!canWrite) {
    error(`No access to '${path}'`);
    process.exit(1);
  }
}

function getSpreadsheetAuthData(args: Arguments): { [key: string]: string | undefined } {
  const { CLIENT_ID, CLIENT_SECRET, SPREADSHEET_ID, SPREADSHEET_NAME, REDIRECT_URI } = process.env;
  const authData = {
    clientId: args.client_id || CLIENT_ID,
    clientSecret: args.client_secret || CLIENT_SECRET,
    spreadsheetId: args.spreadsheet_id || SPREADSHEET_ID,
    spreadsheetName: args.spreadsheet_name || SPREADSHEET_NAME,
    redirectUri: args.redirect_uri || REDIRECT_URI,
  };

  checkAuthParameters(authData);

  return authData;
}

// function saveData(dataToSave: Array<any> | string, merge: boolean, filename: string, extension: string, path: string) {
//   if (merge && typeof dataToSave === 'string') {
//     container.resolve<IFileRepository>('fileRepository').saveData(dataToSave, filename, extension, path);
//     return;
//   }

//   (dataToSave as Array<any>).forEach((data: any) => {
//     const folderName = `${path}/${data.lang}.lproj`;
//     fs.mkdirSync(folderName);
//     container.resolve<IFileRepository>('fileRepository').saveData(data.content, 'Localizable', extension, folderName)
//   });
//   return;
// }

async function main() {
  const { info } = container.resolve<ILogger>('logger');
  const args = configureCli();

  info('Checking auth variables...');
  const spreadsheetAuthData = getSpreadsheetAuthData(args);

  info('Checking formats...');
  const extension = getExtension(args.format);

  info('Checking folder permissions...');
  checkFolderPermissions(args.path);

  info('Fetching spreadsheet...');
  const spreadsheetData = await container.resolve<GoogleSheets>('googleSheets').fetchSpreadsheet(spreadsheetAuthData);
  info('Spreadsheet fetched successfully.');

  info('Formatting spreadsheet...');
  const dataToSave = await container
    .resolve<Transformers>('transformers')
    .transform(spreadsheetData, extension, args.language, args.merge);
  info('Spreadsheet formatted.');

  info(`Saving translations...`);
  container.resolve<FilesCreators>('filesCreators').save(dataToSave, args.path, args.filename, extension);
  info('File successfully saved.');

  process.exit(0);
}

main();
