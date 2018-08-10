#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const yargs = require("yargs");
const file_repository_types_1 = require("../../infrastructure/repository/file-repository.types");
const container_1 = require("./container");
const formatToExtensions_1 = require("./formatToExtensions");
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
async function main() {
    const { info } = container.resolve('logger');
    const args = configureCli();
    info('Checking formats...');
    const extension = formatToExtensions_1.getExtension(args.format);
    info('Checking folder permissions...');
    checkFolderPermissions(args.path);
    info('Fetching spreadsheet...');
    const spreadsheetData = await container.resolve('googleSheets').fetchSpreadsheet();
    info('Spreadsheet fetched successfully.');
    info('Formatting spreadsheet...');
    const dataToSave = await container
        .resolve('transformers')
        .transform(spreadsheetData, extension, args.language);
    info('Spreadsheet formatted.');
    info(`Saving file to ${args.path}/${args.filename}.${args.format}`);
    container.resolve('fileRepository').saveData(dataToSave, args.filename, extension, args.path);
    info('File successfully saved.');
}
main();
