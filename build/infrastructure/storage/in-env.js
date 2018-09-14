"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda = require("ramda");
const envFileVars = [
    'BABELSHEET_CLIENT_ID',
    'BABELSHEET_CLIENT_SECRET',
    'BABELSHEET_SPREADSHEET_ID',
    'BABELSHEET_SPREADSHEET_NAME',
    'BABELSHEET_REFRESH_TOKEN',
    'BABELSHEET_REDIRECT_URI',
    'BABELSHEET_REDIS_HOST',
    'BABELSHEET_REDIS_PORT',
    'BABELSHEET_HOST',
    'BABELSHEET_PORT',
    'NODE_ENV',
    'APP_NAME',
    'LOGGING_LEVEL',
    'TRACING_SERVICE_HOST',
    'TRACING_SERVICE_PORT',
];
class InEnvStorage {
    constructor(fileRepository) {
        this.fileRepository = fileRepository;
    }
    async set(key, value) {
        process.env[key.toUpperCase()] = JSON.stringify(value);
        this.updateEnvsInFile();
    }
    async get(key) {
        return this.tryParse(process.env[key.toUpperCase()]);
    }
    async has(key) {
        return Boolean(await this.get(key.toUpperCase()));
    }
    // tslint:disable-next-line
    async clear() { }
    updateEnvsInFile() {
        const envsForFile = ramda.pick(envFileVars, process.env);
        const result = Object.keys(envsForFile).reduce((sum, val) => `${sum}${val}=${envsForFile[val]}\n`, '');
        this.fileRepository.saveData(result, '', 'env.babelsheet');
    }
    tryParse(value) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return value;
        }
    }
}
exports.default = InEnvStorage;
