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
    transform(source, langCode, mergeLanguages) {
        const json = this.spreadsheetToJson.transform(source, langCode);
        if (mergeLanguages || langCode) {
            return JSON.stringify(json);
        }
        return Object.keys(json).map(langName => {
            const jsonString = JSON.stringify(json[langName]);
            return { lang: langName, content: jsonString };
        });
    }
}
exports.default = SpreadsheetToJsonStringTransformer;
