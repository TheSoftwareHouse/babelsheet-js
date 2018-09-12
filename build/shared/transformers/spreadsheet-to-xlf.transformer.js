"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpreadsheetToXlfTransformer {
    constructor(spreadsheetToJson, jsonToXlf) {
        this.spreadsheetToJson = spreadsheetToJson;
        this.jsonToXlf = jsonToXlf;
        this.supportedType = 'xlf';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source, langCode, mergeLanguages) {
        const json = this.spreadsheetToJson.transform(source, langCode);
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
