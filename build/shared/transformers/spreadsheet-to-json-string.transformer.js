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
    transform(source, { langCode, mergeLanguages, filters, } = {}) {
        const json = this.spreadsheetToJson.transform(source, { langCode });
        const jsonMasked = this.jsonToJsonMasked.transform(json, { filters });
        if (mergeLanguages || langCode) {
            return JSON.stringify(jsonMasked);
        }
        return Object.keys(jsonMasked).map(langName => {
            const jsonString = JSON.stringify(jsonMasked[langName]);
            return { lang: langName, content: jsonString };
        });
    }
}
exports.default = SpreadsheetToJsonStringTransformer;
