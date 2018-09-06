import { AwilixContainer } from 'awilix';
import { ILogger } from 'tsh-node-common';
import { Arguments } from 'yargs';
import IFileRepository from '../../infrastructure/repository/file-repository.types';
import { Permission } from '../../infrastructure/repository/file-repository.types';
import InEnvStorage from '../../infrastructure/storage/in-env';
import { checkAuthParameters } from '../../shared/checkAuthParams';
import { getExtension } from '../../shared/formatToExtensions';
import GoogleAuth from '../../shared/google/auth';
import GoogleSheets from '../../shared/google/sheets';
import Transformers from '../../shared/transformers/transformers';
import FilesCreators from './files-creators/files-creators';
import IStorage from '../../infrastructure/storage/storage';

function checkFolderPermissions(container: AwilixContainer, path: string): void {
  const { error } = container.resolve<ILogger>('logger');

  const canWrite = container.resolve<IFileRepository>('fileRepository').hasAccess(path, Permission.Write);

  if (!canWrite) {
    error(`No access to '${path}'`);
    process.exit(1);
  }
}

function getSpreadsheetAuthData(args: Arguments): { [key: string]: string } {
  const { CLIENT_ID, CLIENT_SECRET, SPREADSHEET_ID, SPREADSHEET_NAME, REDIRECT_URI } = process.env;

  const authData = {
    clientId: args['client-id'] || CLIENT_ID,
    clientSecret: args['client-secret'] || CLIENT_SECRET,
    spreadsheetId: args['spreadsheet-id'] || SPREADSHEET_ID,
    spreadsheetName: args['spreadsheet-name'] || SPREADSHEET_NAME || 'Sheet1',
    redirectUri: args.redirect_uri || REDIRECT_URI || 'http://localhost:3000/oauth2callback',
  };

  return authData;
}

export async function generateTranslations(container: AwilixContainer, args: Arguments) {
  const { info } = container.resolve<ILogger>('logger');

  info('Getting auth variables...');
  const spreadsheetAuthData = getSpreadsheetAuthData(args);

  info('Checking auth variables...');
  checkAuthParameters(spreadsheetAuthData);

  info('Checking formats...');
  const extension = getExtension(args.format);

  info('Checking folder permissions...');
  checkFolderPermissions(container, args.path);

  info('Fetching spreadsheet...');
  const spreadsheetData = await container.resolve<GoogleSheets>('googleSheets').fetchSpreadsheet(spreadsheetAuthData);
  info('Spreadsheet fetched successfully.');

  info('Formatting spreadsheet...');
  const dataToSave = await container
    .resolve<Transformers>('transformers')
    .transform(spreadsheetData, extension, args.language, args.merge);
  info('Spreadsheet formatted.');

  info(`Saving translations...`);
  container.resolve<FilesCreators>('filesCreators').save(dataToSave, args.path, args.filename, extension, args.base);
  info('File successfully saved.');
}

function saveNecessaryEnvToFile(container: AwilixContainer, authData: { [key: string]: string }) {
  const { CLIENT_ID, CLIENT_SECRET, SPREADSHEET_ID, SPREADSHEET_NAME } = process.env;

  if (!authData.clientId || authData.clientId !== CLIENT_ID) {
    container.resolve<InEnvStorage>('inEnvStorage').set('CLIENT_ID', authData.clientId || '');
  }

  if (!authData.clientSecret || authData.clientSecret !== CLIENT_SECRET) {
    container.resolve<InEnvStorage>('inEnvStorage').set('CLIENT_SECRET', authData.clientSecret || '');
  }

  if (!authData.spreadsheetId || authData.spreadsheetId !== SPREADSHEET_ID) {
    container.resolve<InEnvStorage>('inEnvStorage').set('SPREADSHEET_ID', authData.spreadsheetId || '');
  }

  if (authData.spreadsheetName !== SPREADSHEET_NAME) {
    container.resolve<InEnvStorage>('inEnvStorage').set('SPREADSHEET_NAME', authData.spreadsheetName);
  }
}

function getAndSaveAuthData(container: AwilixContainer, args: Arguments) {
  const { info } = container.resolve<ILogger>('logger');

  info('Getting auth variables...');
  const spreadsheetAuthData = getSpreadsheetAuthData(args);

  saveNecessaryEnvToFile(container, spreadsheetAuthData);

  info('Checking auth variables...');
  checkAuthParameters(spreadsheetAuthData);

  return spreadsheetAuthData;
}

async function getRefreshToken(
  container: AwilixContainer,
  { clientId, clientSecret, redirectUri }: { [key: string]: string }
) {
  const oAuth2Client = await container
    .resolve<GoogleAuth>('googleAuth')
    .createOAuthClient(clientId, clientSecret, redirectUri);

  const { refresh_token } = await container.resolve<GoogleAuth>('googleAuth').getTokens(oAuth2Client);
  return refresh_token;
}

export async function generateConfigFile(container: AwilixContainer, args: Arguments, storage: IStorage) {
  const { info } = container.resolve<ILogger>('logger');

  const spreadsheetAuthData = getAndSaveAuthData(container, args);

  info('Acquiring refresh token...');
  const refreshToken = await getRefreshToken(container, spreadsheetAuthData);

  info('Saving token...');
  storage.set('refresh_token', refreshToken);
  info('Refresh token saved');
}
