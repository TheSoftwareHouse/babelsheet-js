"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FakeGoogleSheets {
    constructor(returnData) {
        this.returnData = returnData;
    }
    async fetchSpreadsheet(credentials) {
        return this.returnData;
    }
}
exports.default = FakeGoogleSheets;
