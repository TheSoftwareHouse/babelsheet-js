"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_repository_types_1 = require("../../infrastructure/repository/file-repository.types");
const formatToExtensions_1 = require("../../shared/formatToExtensions");
function checkFolderPermissions(logger, fileRepository, path) {
    const canWrite = fileRepository.hasAccess(path, file_repository_types_1.Permission.Write);
    if (!canWrite) {
        logger.error(`No access to '${path}'`);
        process.exit(1);
    }
}
async function generateTranslations(logger, fileRepository, sheetsProvider, configProvider, transformers, filesCreators, args) {
    const { info } = logger;
    info('Getting auth variables...');
    const spreadsheetConfig = configProvider.getSpreadsheetConfig(args);
    info('Checking auth variables...');
    configProvider.validateConfig(spreadsheetConfig);
    info('Checking formats...');
    const extension = formatToExtensions_1.getExtension(args.format);
    info('Checking folder permissions...');
    checkFolderPermissions(logger, fileRepository, args.path);
    info('Reading spreadsheet...');
    const spreadsheetData = await sheetsProvider.getSpreadsheetValues(spreadsheetConfig);
    info('Spreadsheet fetched successfully.');
    const transformedSheets = await Object.keys(spreadsheetData).reduce(async (transformedSheetsPromise, key) => {
        info(`Formatting spreadsheet - version ${key}`);
        const values = spreadsheetData[key];
        if (!values) {
            return transformedSheetsPromise;
        }
        const data = await transformers.transform({
            result: spreadsheetData[key],
            translations: {},
            meta: {
                includeComments: args.comments,
                langCode: args.language,
                mergeLanguages: args.merge,
                filters: args.filters,
            },
        }, extension);
        const sheets = await transformedSheetsPromise;
        sheets[key] = data;
        return transformedSheetsPromise;
    }, Promise.resolve({}));
    for (const version of Object.keys(transformedSheets)) {
        info(`Spreadsheet with version ${version} formatted.`);
        info(`Saving translations - version ${version}`);
        filesCreators.save(transformedSheets[version], args.path, args.filename, extension, version, args.base);
        info(`File (version ${version}) successfully saved.`);
    }
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
function getAndSaveAuthData(logger, inEnvStorage, args, configProvider) {
    logger.info('Getting auth variables...');
    const spreadsheetAuthData = configProvider.getSpreadsheetConfig(args);
    saveNecessaryEnvToFile(inEnvStorage, spreadsheetAuthData);
    logger.info('Checking auth variables...');
    configProvider.validateConfig(spreadsheetAuthData);
    return spreadsheetAuthData;
}
async function getRefreshToken(googleAuth, { clientId, clientSecret, redirectUri }) {
    const oAuth2Client = await googleAuth.createOAuthClient(clientId, clientSecret, redirectUri);
    const { refresh_token } = await googleAuth.getTokens(oAuth2Client);
    return refresh_token;
}
async function generateConfigFile(logger, inEnvStorage, googleAuth, args, storage, configProvider) {
    const spreadsheetAuthData = getAndSaveAuthData(logger, inEnvStorage, args, configProvider);
    logger.info('Acquiring refresh token...');
    const refreshToken = await getRefreshToken(googleAuth, spreadsheetAuthData);
    logger.info('Saving token...');
    storage.set('babelsheet_refresh_token', refreshToken);
    logger.info('Refresh token saved');
}
exports.generateConfigFile = generateConfigFile;
