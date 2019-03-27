"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GoogleSpreadsheetConfigService {
    getSpreadsheetConfig(args) {
        const { BABELSHEET_CLIENT_ID, BABELSHEET_CLIENT_SECRET, BABELSHEET_SPREADSHEET_ID, BABELSHEET_SPREADSHEET_NAME, BABELSHEET_REDIRECT_URI, } = process.env;
        const config = {
            clientId: args['client-id'] || BABELSHEET_CLIENT_ID,
            clientSecret: args['client-secret'] || BABELSHEET_CLIENT_SECRET,
            spreadsheetId: args['spreadsheet-id'] || BABELSHEET_SPREADSHEET_ID,
            spreadsheetName: args['spreadsheet-name'] || BABELSHEET_SPREADSHEET_NAME,
            redirectUri: args.redirect_uri || BABELSHEET_REDIRECT_URI || 'http://localhost:3000/oauth2callback',
        };
        return config;
    }
    supports(type) {
        return type === 'google';
    }
    validateConfig(config) {
        if (!config.clientId) {
            throw new Error('Please provide Client ID');
        }
        if (!config.clientSecret) {
            throw new Error('Please provide Client Secret');
        }
        if (!config.spreadsheetId) {
            throw new Error('Please provide spreadsheet ID');
        }
    }
}
exports.GoogleSpreadsheetConfigService = GoogleSpreadsheetConfigService;
