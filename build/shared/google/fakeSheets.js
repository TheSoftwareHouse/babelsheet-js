"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
class FakeGoogleSheets {
    constructor(returnData) {
        this.returnData = returnData;
    }
    async fetchSpreadsheet(credentials) {
        return util.promisify(() => this.returnData)().then((res) => res);
    }
}
exports.default = FakeGoogleSheets;
