"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpreadsheetToJsonStringTransformer {
    constructor(spreadsheetToJson, jsonToJsonMasked) {
        this.spreadsheetToJson = spreadsheetToJson;
        this.jsonToJsonMasked = jsonToJsonMasked;
        this.supportedType = 'json';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source, langCode, mergeLanguages, filters) {
        let json = this.spreadsheetToJson.transform(source, langCode);
        json = this.jsonToJsonMasked.transform(json, undefined, undefined, filters);
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
