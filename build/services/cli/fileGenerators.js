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
    const { BABELSHEET_CLIENT_ID, BABELSHEET_CLIENT_SECRET, BABELSHEET_SPREADSHEET_ID, BABELSHEET_SPREADSHEET_NAME, BABELSHEET_REDIRECT_URI, } = process.env;
    const authData = {
        clientId: args['client-id'] || BABELSHEET_CLIENT_ID,
        clientSecret: args['client-secret'] || BABELSHEET_CLIENT_SECRET,
        spreadsheetId: args['spreadsheet-id'] || BABELSHEET_SPREADSHEET_ID,
        spreadsheetName: args['spreadsheet-name'] || BABELSHEET_SPREADSHEET_NAME || 'Sheet1',
        redirectUri: args.redirect_uri || BABELSHEET_REDIRECT_URI || 'http://localhost:3000/oauth2callback',
    };
    return authData;
}
async function generateTranslations(container, args) {
    const { info } = container.resolve('logger');
    info('Getting auth variables...');
    const spreadsheetAuthData = getSpreadsheetAuthData(args);
    info('Checking auth variables...');
    checkAuthParams_1.checkAuthParameters(spreadsheetAuthData);
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
function saveNecessaryEnvToFile(container, authData) {
    const { BABELSHEET_CLIENT_ID, BABELSHEET_CLIENT_SECRET, BABELSHEET_SPREADSHEET_ID, BABELSHEET_SPREADSHEET_NAME, } = process.env;
    if (!authData.clientId || authData.clientId !== BABELSHEET_CLIENT_ID) {
        container.resolve('inEnvStorage').set('CLIENT_ID', authData.clientId || '');
    }
    if (!authData.clientSecret || authData.clientSecret !== BABELSHEET_CLIENT_SECRET) {
        container.resolve('inEnvStorage').set('CLIENT_SECRET', authData.clientSecret || '');
    }
    if (!authData.spreadsheetId || authData.spreadsheetId !== BABELSHEET_SPREADSHEET_ID) {
        container.resolve('inEnvStorage').set('SPREADSHEET_ID', authData.spreadsheetId || '');
    }
    if (authData.spreadsheetName !== BABELSHEET_SPREADSHEET_NAME) {
        container.resolve('inEnvStorage').set('SPREADSHEET_NAME', authData.spreadsheetName);
    }
}
function getAndSaveAuthData(container, args) {
    const { info } = container.resolve('logger');
    info('Getting auth variables...');
    const spreadsheetAuthData = getSpreadsheetAuthData(args);
    saveNecessaryEnvToFile(container, spreadsheetAuthData);
    info('Checking auth variables...');
    checkAuthParams_1.checkAuthParameters(spreadsheetAuthData);
    return spreadsheetAuthData;
}
async function getRefreshToken(container, { clientId, clientSecret, redirectUri }) {
    const oAuth2Client = await container
        .resolve('googleAuth')
        .createOAuthClient(clientId, clientSecret, redirectUri);
    const { refresh_token } = await container.resolve('googleAuth').getTokens(oAuth2Client);
    return refresh_token;
}
async function generateConfigFile(container, args, storage) {
    const { info } = container.resolve('logger');
    const spreadsheetAuthData = getAndSaveAuthData(container, args);
    info('Acquiring refresh token...');
    const refreshToken = await getRefreshToken(container, spreadsheetAuthData);
    info('Saving token...');
    storage.set('babelsheet_refresh_token', refreshToken);
    info('Refresh token saved');
}
exports.generateConfigFile = generateConfigFile;
