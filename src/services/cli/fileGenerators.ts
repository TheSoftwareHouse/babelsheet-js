import { AwilixContainer } from 'awilix';
import { ILogger } from 'tsh-node-common';
import { Arguments } from 'yargs';
import IFileRepository from '../../infrastructure/repository/file-repository.types';
import { Permission } from '../../infrastructure/repository/file-repository.types';
import InEnvStorage from '../../infrastructure/storage/in-env';
import InFileStorage from '../../infrastructure/storage/in-file';
import { checkAuthParameters } from '../../shared/checkAuthParams';
import { getExtension } from '../../shared/formatToExtensions';
import GoogleAuth from '../../shared/google/auth';
import GoogleSheets from '../../shared/google/sheets';
import Transformers from '../../shared/transformers/transformers';
import FilesCreators from './files-creators/files-creators';

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
    clientId: args.client_id || CLIENT_ID,
    clientSecret: args.client_secret || CLIENT_SECRET,
    spreadsheetId: args.spreadsheet_id || SPREADSHEET_ID,
    spreadsheetName: args.spreadsheet_name || SPREADSHEET_NAME || 'Sheet1',
    redirectUri: args.redirect_uri || REDIRECT_URI || 'http://localhost:3000/oauth2callback',
  };

  checkAuthParameters(authData);

  return authData;
}

export async function generateTranslations(container: AwilixContainer, args: Arguments) {
  const { info } = container.resolve<ILogger>('logger');

  info('Checking auth variables...');
  const spreadsheetAuthData = getSpreadsheetAuthData(args);

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
  container.resolve<FilesCreators>('filesCreators').save(dataToSave, args.path, args.filename, extension);
  info('File successfully saved.');
}

async function getRefreshToken(container: AwilixContainer, args: Arguments) {
  const { info } = container.resolve<ILogger>('logger');

  info('Checking auth variables...');
  const { clientId, clientSecret, redirectUri } = getSpreadsheetAuthData(args);

  info('Google authentication...');
  const oAuth2Client = await container
    .resolve<GoogleAuth>('googleAuth')
    .createOAuthClient(clientId, clientSecret, redirectUri);

  info('Getting google tokens');
  const { refresh_token } = await container.resolve<GoogleAuth>('googleAuth').getTokens(oAuth2Client);
  return refresh_token;
}

export async function generateEnvConfigFile(container: AwilixContainer, args: Arguments) {
  const { info } = container.resolve<ILogger>('logger');
  const refreshToken = await getRefreshToken(container, args);

  info('Saving token to .env file');
  container.resolve<InEnvStorage>('inEnvStorage').set('refresh_token', refreshToken);
  info('.env file created');
}

export async function generateJsonConfigFile(container: AwilixContainer, args: Arguments) {
  const { info } = container.resolve<ILogger>('logger');
  const refreshToken = await getRefreshToken(container, args);

  info('Saving token to data.json file');
  container.resolve<InFileStorage>('inFileStorage').set('refresh_token', refreshToken);
  info('data.json file created');
}
