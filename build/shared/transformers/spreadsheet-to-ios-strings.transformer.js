"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpreadsheetToIosStringsTransformer {
    constructor(spreadsheetToJson, jsonToIosStrings) {
        this.spreadsheetToJson = spreadsheetToJson;
        this.jsonToIosStrings = jsonToIosStrings;
        this.supportedType = 'strings';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source, langCode, mergeLanguages) {
        const json = this.spreadsheetToJson.transform(source, langCode);
        if (mergeLanguages || langCode) {
            return this.jsonToIosStrings.transform(json);
        }
        return Object.keys(json).map(langName => {
            const iosStrings = this.jsonToIosStrings.transform(json[langName]);
            return { lang: langName, content: iosStrings };
        });
    }
}
exports.default = SpreadsheetToIosStringsTransformer;
