"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testData_1 = require("./testData");
class FakeGoogleSheets {
    constructor(returnData = testData_1.spreadsheetData.multiRawSpreadsheetData) {
        this.returnData = returnData;
    }
    async getSpreadsheetValues(credentials) {
        return this.returnData;
    }
    supports(type) {
        return type === 'google';
    }
}
exports.default = FakeGoogleSheets;
