"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const util = require("util");
class GoogleSheets {
    constructor(googleAuth) {
        this.googleAuth = googleAuth;
    }
    async fetchSpreadsheet(credentials) {
        const oAuth2Client = await this.googleAuth.getAuthenticatedClient(credentials);
        const sheets = googleapis_1.google.sheets('v4');
        return util
            .promisify(sheets.spreadsheets.values.get)({
            auth: oAuth2Client,
            range: credentials.spreadsheetName,
            spreadsheetId: credentials.spreadsheetId,
        })
            .then((res) => res.data.values);
    }
}
exports.default = GoogleSheets;
