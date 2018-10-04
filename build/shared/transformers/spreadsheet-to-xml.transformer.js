"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpreadsheetToXmlTransformer {
    constructor(spreadsheetToJson, jsonToXml, jsonToJsonMasked) {
        this.spreadsheetToJson = spreadsheetToJson;
        this.jsonToXml = jsonToXml;
        this.jsonToJsonMasked = jsonToJsonMasked;
        this.supportedType = 'xml';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source, { langCode, mergeLanguages, filters, } = {}) {
        const json = this.spreadsheetToJson.transform(source, { langCode });
        const jsonMasked = this.jsonToJsonMasked.transform(json, { filters });
        if (mergeLanguages || langCode) {
            return this.jsonToXml.transform(jsonMasked);
        }
        return Object.keys(jsonMasked).map(langName => {
            const xmlTranslations = this.jsonToXml.transform(jsonMasked[langName]);
            return { lang: langName, content: xmlTranslations };
        });
    }
}
exports.default = SpreadsheetToXmlTransformer;
