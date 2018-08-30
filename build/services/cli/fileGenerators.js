"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_repository_types_1 = require("../../infrastructure/repository/file-repository.types");
const checkAuthParams_1 = require("../../shared/checkAuthParams");
const formatToExtensions_1 = require("../../shared/formatToExtensions");
function checkFolderPermissions(container, path) {
    const { error } = container.resolve('logger');
    const canWrite = container.resolve('fileRepository').hasAccess(path, file_repository_types_1.Permission.Write);
    if (!canWrite) {
        error(`No access to '${path}'`);
        process.exit(1);
    }
}
function getSpreadsheetAuthData(args) {
    const { CLIENT_ID, CLIENT_SECRET, SPREADSHEET_ID, SPREADSHEET_NAME, REDIRECT_URI } = process.env;
    const authData = {
        clientId: args.client_id || CLIENT_ID,
        clientSecret: args.client_secret || CLIENT_SECRET,
        spreadsheetId: args.spreadsheet_id || SPREADSHEET_ID,
        spreadsheetName: args.spreadsheet_name || SPREADSHEET_NAME || 'Sheet1',
        redirectUri: args.redirect_uri || REDIRECT_URI || 'http://localhost:3000/oauth2callback',
    };
    checkAuthParams_1.checkAuthParameters(authData);
    return authData;
}
async function generateTranslations(container, args) {
    const { info } = container.resolve('logger');
    info('Checking auth variables...');
    const spreadsheetAuthData = getSpreadsheetAuthData(args);
    info('Checking formats...');
    const extension = formatToExtensions_1.getExtension(args.format);
    info('Checking folder permissions...');
    checkFolderPermissions(container, args.path);
    info('Fetching spreadsheet...');
    const spreadsheetData = await container.resolve('googleSheets').fetchSpreadsheet(spreadsheetAuthData);
    info('Spreadsheet fetched successfully.');
    info('Formatting spreadsheet...');
    const dataToSave = await container
        .resolve('transformers')
        .transform(spreadsheetData, extension, args.language, args.merge);
    info('Spreadsheet formatted.');
    info(`Saving translations...`);
    container.resolve('filesCreators').save(dataToSave, args.path, args.filename, extension, args.base);
    info('File successfully saved.');
}
exports.generateTranslations = generateTranslations;
async function getRefreshToken(container, args) {
    const { info } = container.resolve('logger');
    info('Checking auth variables...');
    const { clientId, clientSecret, redirectUri } = getSpreadsheetAuthData(args);
    info('Google authentication...');
    const oAuth2Client = await container
        .resolve('googleAuth')
        .createOAuthClient(clientId, clientSecret, redirectUri);
    info('Getting google tokens');
    const { refresh_token } = await container.resolve('googleAuth').getTokens(oAuth2Client);
    return refresh_token;
}
async function generateEnvConfigFile(container, args) {
    const { info } = container.resolve('logger');
    const refreshToken = await getRefreshToken(container, args);
    info('Saving token to .env file');
    container.resolve('inEnvStorage').set('refresh_token', refreshToken);
    info('.env file created');
}
exports.generateEnvConfigFile = generateEnvConfigFile;
async function generateJsonConfigFile(container, args) {
    const { info } = container.resolve('logger');
    const refreshToken = await getRefreshToken(container, args);
    info('Saving token to data.json file');
    container.resolve('inFileStorage').set('refresh_token', refreshToken);
    info('data.json file created');
}
exports.generateJsonConfigFile = generateJsonConfigFile;
