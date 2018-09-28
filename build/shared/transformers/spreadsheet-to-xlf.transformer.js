"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpreadsheetToXlfTransformer {
    constructor(spreadsheetToJson, jsonToXlf, jsonToJsonMasked) {
        this.spreadsheetToJson = spreadsheetToJson;
        this.jsonToXlf = jsonToXlf;
        this.jsonToJsonMasked = jsonToJsonMasked;
        this.supportedType = 'xlf';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source, langCode, mergeLanguages, filters) {
        let json = this.spreadsheetToJson.transform(source, langCode);
        json = this.jsonToJsonMasked.transform(json, undefined, undefined, filters);
        if (mergeLanguages || langCode) {
            return this.jsonToXlf.transform(json);
        }
        return Object.keys(json).map(langName => {
            const xlfTranslations = this.jsonToXlf.transform(json[langName]);
            return { lang: langName, content: xlfTranslations };
        });
    }
}
exports.default = SpreadsheetToXlfTransformer;
