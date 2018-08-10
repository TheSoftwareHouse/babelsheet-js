"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const util = require("util");
class GoogleSheets {
    constructor(googleAuth) {
        this.googleAuth = googleAuth;
    }
    async fetchSpreadsheet() {
        const oAuth2Client = await this.googleAuth.getAuthenticatedClient();
        const sheets = googleapis_1.google.sheets('v4');
        return util
            .promisify(sheets.spreadsheets.values.get)({
            auth: oAuth2Client,
            range: process.env.SPREADSHEET_NAME,
            spreadsheetId: process.env.SPREADSHEET_ID,
        })
            .then((res) => res.data.values);
    }
}
exports.default = GoogleSheets;
