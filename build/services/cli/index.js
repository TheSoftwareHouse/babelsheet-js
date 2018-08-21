#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const yargs = require("yargs");
const file_repository_types_1 = require("../../infrastructure/repository/file-repository.types");
const checkAuthParams_1 = require("../../shared/checkAuthParams");
const formatToExtensions_1 = require("../../shared/formatToExtensions");
const container_1 = require("./container");
dotenv.config();
const container = container_1.default();
process.on('uncaughtException', err => {
    container.resolve('logger').error(err.toString());
    process.exit(1);
});
process.on('unhandledRejection', err => {
    container.resolve('logger').error(err.toString());
    process.exit(1);
});
function configureCli() {
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
        .example('$0 generate -f xml -n my-data -p ./result -l en_US', 'Generate my-data.xml with english translations in folder /result')
        .example('$0 generate -n my-data', 'Generate file with result in json extension').argv;
}
function checkFolderPermissions(path) {
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
        spreadsheetName: args.spreadsheet_name || SPREADSHEET_NAME,
        redirectUri: args.redirect_uri || REDIRECT_URI,
    };
    checkAuthParams_1.checkAuthParameters(authData);
    return authData;
}
async function main() {
    const { info } = container.resolve('logger');
    const args = configureCli();
    info('Checking auth variables...');
    const spreadsheetAuthData = getSpreadsheetAuthData(args);
    info('Checking formats...');
    const extension = formatToExtensions_1.getExtension(args.format);
    info('Checking folder permissions...');
    checkFolderPermissions(args.path);
    info('Fetching spreadsheet...');
    const spreadsheetData = await container.resolve('googleSheets').fetchSpreadsheet(spreadsheetAuthData);
    info('Spreadsheet fetched successfully.');
    info('Formatting spreadsheet...');
    const dataToSave = await container
        .resolve('transformers')
        .transform(spreadsheetData, extension, args.language, args.merge);
    info('Spreadsheet formatted.');
    info(`Saving translations...`);
    container.resolve('filesCreators').save(dataToSave, args.path, args.filename, extension);
    info('File successfully saved.');
    process.exit(0);
}
main();
