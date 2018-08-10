"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpreadsheetToJsonStringTransformer {
    constructor(spreadsheetToJson) {
        this.spreadsheetToJson = spreadsheetToJson;
        this.supportedType = 'json';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source, langCode) {
        return JSON.stringify(this.spreadsheetToJson.transform(source, langCode));
    }
}
exports.default = SpreadsheetToJsonStringTransformer;
