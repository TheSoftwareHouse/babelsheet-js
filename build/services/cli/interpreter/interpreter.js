"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const fileGenerators_1 = require("../fileGenerators");
class Interpreter {
    constructor(shadowArgs, logger, inEnvStorage, inFileStorage, googleAuth, fileRepository, sheetsProviderFactory, configProviderFactory, transformers, filesCreators) {
        this.shadowArgs = shadowArgs;
        this.logger = logger;
        this.inEnvStorage = inEnvStorage;
        this.inFileStorage = inFileStorage;
        this.googleAuth = googleAuth;
        this.fileRepository = fileRepository;
        this.sheetsProviderFactory = sheetsProviderFactory;
        this.configProviderFactory = configProviderFactory;
        this.transformers = transformers;
        this.filesCreators = filesCreators;
        this.getProperStorage = {
            env: this.inEnvStorage,
            json: this.inFileStorage,
        };
    }
    async interpret(overwriteShadowArgs) {
        const args = this.configureCli(overwriteShadowArgs);
        const { BABELSHEET_SPREADSHEET_SOURCE } = process.env;
        const spreadsheetSource = args['spreadsheet-source'] || BABELSHEET_SPREADSHEET_SOURCE || 'google';
        const sheetsProvider = this.getSpreadsheetProvider(spreadsheetSource);
        const sheetsConfigProvider = this.getSpreadsheetConfigProvider(spreadsheetSource);
        if (args._[0] === 'init') {
            if (spreadsheetSource === 'in-file') {
                this.logger.error('`init` option cannot be used when spreadsheet source is set to `in-file`');
                process.exit(1);
            }
            await fileGenerators_1.generateConfigFile(this.logger, this.inEnvStorage, this.googleAuth, args, this.getProperStorage[args['config-format']], sheetsConfigProvider);
        }
        else {
            await fileGenerators_1.generateTranslations(this.logger, this.fileRepository, sheetsProvider, sheetsConfigProvider, this.transformers, this.filesCreators, args);
        }
    }
    configureCli(overwriteShadowArgs) {
        let parser = yargs
            .usage('Usage: generate [-f "format"] [-n "filename"] [-p "path"]')
            .command('init', 'Generates config file with token for google auth')
            .option('cf', {
            alias: 'config-format',
            default: 'env',
            describe: 'Config format type',
            type: 'string',
            choices: ['env', 'json'],
        })
            .command('generate', 'Generate file with translations')
            .required(1, 'generate')
            .option('f', {
            alias: 'format',
            default: 'json',
            describe: 'Format type',
            type: 'string',
            choices: ['android', 'json', 'ios', 'yml', 'xlf', 'po'],
        })
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
            .option('filters', {
            describe: 'Filters, separated by spaces, with dots between keys (--filter en_US.CORE.GENERAL en_US.CORE.SPECIFIC)',
            type: 'array',
        })
            .option('ss', {
            alias: 'spreadsheet-source',
            describe: 'Determines from where the spreadsheet is read',
            type: 'string',
        })
            .options('fp', {
            alias: 'file-path',
            describe: 'Spreadsheet file location.',
            type: 'string',
        })
            .options('comments', {
            describe: 'Include comments in the outputs',
            type: 'boolean',
            default: false,
        })
            .command('generate-snap', 'Generate files from given parameters, with mocked google sheets')
            .help('?')
            .alias('?', 'help')
            .example('$0 generate -f android -n my-data -p ./result -l en_US --merge', 'Generate my-data.xml with english translations in folder /result')
            .example('$0 generate --base pl_PL --format ios', 'Generate translations in current directory in ios format');
        // custom parser when shadowing args, because the test fail with no message otherwise. Can be a huge timesink.
        if (this.shadowArgs || overwriteShadowArgs) {
            parser = parser.fail((msg, err) => {
                this.logger.error(`${msg ? `Failure message: ${msg} ` : ''}${err ? `Error: ${err}` : ''}`);
                process.exit(1);
            });
        }
        return parser.parse(this.shadowArgs || overwriteShadowArgs);
    }
    getSpreadsheetConfigProvider(spreadsheetSource) {
        return this.configProviderFactory.getProviderFor(spreadsheetSource);
    }
    getSpreadsheetProvider(spreadsheetSource) {
        return this.sheetsProviderFactory.getProviderFor(spreadsheetSource);
    }
}
exports.default = Interpreter;
