"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_repository_types_1 = require("../../infrastructure/repository/file-repository.types");
const checkAuthParams_1 = require("../../shared/checkAuthParams");
const formatToExtensions_1 = require("../../shared/formatToExtensions");
function checkFolderPermissions(logger, fileRepository, path) {
    const canWrite = fileRepository.hasAccess(path, file_repository_types_1.Permission.Write);
    if (!canWrite) {
        logger.error(`No access to '${path}'`);
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
async function generateTranslations(logger, fileRepository, googleSheets, transformers, filesCreators, args) {
    const { info } = logger;
    info('Getting auth variables...');
    const spreadsheetAuthData = getSpreadsheetAuthData(args);
    info('Checking auth variables...');
    checkAuthParams_1.checkAuthParameters(spreadsheetAuthData);
    info('Checking formats...');
    const extension = formatToExtensions_1.getExtension(args.format);
    info('Checking folder permissions...');
    checkFolderPermissions(logger, fileRepository, args.path);
    info('Fetching spreadsheet...');
    const spreadsheetData = await googleSheets.fetchSpreadsheet(spreadsheetAuthData);
    info('Spreadsheet fetched successfully.');
    info('Formatting spreadsheet...');
    const dataToSave = await transformers.transform({
        result: spreadsheetData,
        translations: {},
        meta: {
            includeComments: args.comments,
            langCode: args.language,
            mergeLanguages: args.merge,
            filters: args.filters,
        },
    }, extension);
    info('Spreadsheet formatted.');
    info(`Saving translations...`);
    filesCreators.save(dataToSave, args.path, args.filename, extension, args.base);
    info('File successfully saved.');
}
exports.generateTranslations = generateTranslations;
function saveNecessaryEnvToFile(inEnvStorage, authData) {
    const { BABELSHEET_CLIENT_ID, BABELSHEET_CLIENT_SECRET, BABELSHEET_SPREADSHEET_ID, BABELSHEET_SPREADSHEET_NAME, } = process.env;
    if (!authData.clientId || authData.clientId !== BABELSHEET_CLIENT_ID) {
        inEnvStorage.set('CLIENT_ID', authData.clientId || '');
    }
    if (!authData.clientSecret || authData.clientSecret !== BABELSHEET_CLIENT_SECRET) {
        inEnvStorage.set('CLIENT_SECRET', authData.clientSecret || '');
    }
    if (!authData.spreadsheetId || authData.spreadsheetId !== BABELSHEET_SPREADSHEET_ID) {
        inEnvStorage.set('SPREADSHEET_ID', authData.spreadsheetId || '');
    }
    if (authData.spreadsheetName !== BABELSHEET_SPREADSHEET_NAME) {
        inEnvStorage.set('SPREADSHEET_NAME', authData.spreadsheetName);
    }
}
function getAndSaveAuthData(logger, inEnvStorage, args) {
    logger.info('Getting auth variables...');
    const spreadsheetAuthData = getSpreadsheetAuthData(args);
    saveNecessaryEnvToFile(inEnvStorage, spreadsheetAuthData);
    logger.info('Checking auth variables...');
    checkAuthParams_1.checkAuthParameters(spreadsheetAuthData);
    return spreadsheetAuthData;
}
async function getRefreshToken(googleAuth, { clientId, clientSecret, redirectUri }) {
    const oAuth2Client = await googleAuth.createOAuthClient(clientId, clientSecret, redirectUri);
    const { refresh_token } = await googleAuth.getTokens(oAuth2Client);
    return refresh_token;
}
async function generateConfigFile(logger, inEnvStorage, googleAuth, args, storage) {
    const spreadsheetAuthData = getAndSaveAuthData(logger, inEnvStorage, args);
    logger.info('Acquiring refresh token...');
    const refreshToken = await getRefreshToken(googleAuth, spreadsheetAuthData);
    logger.info('Saving token...');
    storage.set('babelsheet_refresh_token', refreshToken);
    logger.info('Refresh token saved');
}
exports.generateConfigFile = generateConfigFile;
