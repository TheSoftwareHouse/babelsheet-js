"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpreadsheetToXmlTransformer {
    constructor(spreadsheetToJson, jsonToXml) {
        this.spreadsheetToJson = spreadsheetToJson;
        this.jsonToXml = jsonToXml;
        this.supportedType = 'xml';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source, langCode, mergeLanguages) {
        const json = this.spreadsheetToJson.transform(source, langCode);
        if (mergeLanguages || langCode) {
            return this.jsonToXml.transform(json);
        }
        return Object.keys(json).map(langName => {
            const xmlTranslations = this.jsonToXml.transform(json[langName]);
            return { lang: langName, content: xmlTranslations };
        });
    }
}
exports.default = SpreadsheetToXmlTransformer;
