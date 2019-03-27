"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const util = require("util");
class GoogleSheetsProvider {
    constructor(googleAuth) {
        this.googleAuth = googleAuth;
    }
    async getSpreadsheetValues(credentials) {
        const oAuth2Client = await this.googleAuth.getAuthenticatedClient(credentials);
        const sheets = googleapis_1.google.sheets('v4');
        const { spreadsheetId, spreadsheetName } = credentials;
        const ranges = spreadsheetName
            ? [spreadsheetName]
            : await this.getAllSpreadsheetsNames(oAuth2Client, spreadsheetId);
        return util
            .promisify(sheets.spreadsheets.values.batchGet)({
            auth: oAuth2Client,
            ranges,
            spreadsheetId,
        })
            .then((res) => {
            const valuesBySpreadsheet = {};
            for (let i = 0; i < res.data.valueRanges.length; ++i) {
                valuesBySpreadsheet[ranges[i]] = res.data.valueRanges[i].values;
            }
            return valuesBySpreadsheet;
        });
    }
    supports(type) {
        return type === 'google';
    }
    getAllSpreadsheetsNames(auth, spreadsheetId) {
        const sheets = googleapis_1.google.sheets('v4');
        return util
            .promisify(sheets.spreadsheets.get)({
            auth,
            ranges: [],
            spreadsheetId,
        })
            .then((res) => res.data.sheets.map((sheet) => sheet.properties.title));
    }
}
exports.default = GoogleSheetsProvider;
