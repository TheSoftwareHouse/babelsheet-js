"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InFileSpreadsheetConfigService {
    getSpreadsheetConfig(args) {
        const { BABELSHEET_SPREADSHEET_SOURCE, BABELSHEET_SPREADSHEET_NAME, BABELSHEET_SPREADSHEET_FILE_PATH, } = process.env;
        const config = {
            spreadsheetName: args['spreadsheet-name'] || BABELSHEET_SPREADSHEET_NAME,
            spreadsheetSource: args['spreadsheet-source'] || BABELSHEET_SPREADSHEET_SOURCE,
            spreadsheetFilePath: args['file-path'] || BABELSHEET_SPREADSHEET_FILE_PATH,
        };
        return config;
    }
    supports(type) {
        return type === 'in-file';
    }
    validateConfig(config) {
        if (!config.spreadsheetFilePath) {
            throw new Error('Please provide file path with spreadsheet.');
        }
    }
}
exports.InFileSpreadsheetConfigService = InFileSpreadsheetConfigService;
