"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkAuthParameters(params) {
    if (!params.clientId) {
        throw new Error('Please provide Client ID');
    }
    if (!params.clientSecret) {
        throw new Error('Please provide Client Secret');
    }
    if (!params.spreadsheetId) {
        throw new Error('Please provide spreadsheet ID');
    }
    if (!params.spreadsheetName) {
        throw new Error('Please provide spreadsheet name');
    }
}
exports.checkAuthParameters = checkAuthParameters;
