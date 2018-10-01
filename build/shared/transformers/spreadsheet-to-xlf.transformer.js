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
    transform(source, { langCode, mergeLanguages, filters, } = {}) {
        const json = this.spreadsheetToJson.transform(source, { langCode });
        const jsonMasked = this.jsonToJsonMasked.transform(json, { filters });
        if (mergeLanguages || langCode) {
            return this.jsonToXlf.transform(jsonMasked);
        }
        return Object.keys(jsonMasked).map(langName => {
            const xlfTranslations = this.jsonToXlf.transform(jsonMasked[langName]);
            return { lang: langName, content: xlfTranslations };
        });
    }
}
exports.default = SpreadsheetToXlfTransformer;
