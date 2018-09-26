#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const BABELSHEET_ENV_PATH = '.env.babelsheet';
dotenv.config();
dotenv.config({ path: BABELSHEET_ENV_PATH });
const yargs = require("yargs");
const container_1 = require("./container");
const fileGenerators_1 = require("./fileGenerators");
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
        .command('init', 'Generates config file with token for google auth')
        .option('cf', { alias: 'config-format', default: 'env', describe: 'Config format type', type: 'string', choices: ['env', 'json'] })
        .command('generate', 'Generate file with translations')
        .required(1, 'generate')
        .option('f', { alias: 'format', default: 'json', describe: 'Format type', type: 'string', choices: ['android', 'json', 'ios', 'yml', 'xlf'] })
        .option('p', { alias: 'path', default: '.', describe: 'Path for saving file', type: 'string' })
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
        .option('base', { default: 'en', describe: 'Base language for translations', type: 'string' })
        .option('merge', { default: 'false', describe: 'Create one file with all languages', type: 'boolean' })
        .option('client-id', { describe: 'Client ID', type: 'string' })
        .option('client-secret', { describe: 'Client secret', type: 'string' })
        .option('spreadsheet-id', { describe: 'Spreadsheet ID', type: 'string' })
        .option('spreadsheet-name', { describe: 'Spreadsheet name', type: 'string' })
        .option('redirect-uri', { describe: 'The URI to redirect after completing the auth request' })
        .help('?')
        .alias('?', 'help')
        .example('$0 generate -f xml -n my-data -p ./result -l en_US --merge', 'Generate my-data.xml with english translations in folder /result')
        .example('$0 generate --base pl_PL --format ios', 'Generate translations in current directory in ios format').argv;
}
const getProperStorage = {
    env: container.resolve('inEnvStorage'),
    json: container.resolve('inFileStorage'),
};
async function main() {
    const args = configureCli();
    args._[0] === 'init'
        ? await fileGenerators_1.generateConfigFile(container, args, getProperStorage[args['config-format']])
        : await fileGenerators_1.generateTranslations(container, args);
    process.exit(0);
}
main();
