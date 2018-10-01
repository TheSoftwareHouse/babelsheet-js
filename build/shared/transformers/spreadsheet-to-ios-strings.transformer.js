"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpreadsheetToIosStringsTransformer {
    constructor(spreadsheetToJson, jsonToIosStrings, jsonToJsonMasked) {
        this.spreadsheetToJson = spreadsheetToJson;
        this.jsonToIosStrings = jsonToIosStrings;
        this.jsonToJsonMasked = jsonToJsonMasked;
        this.supportedType = 'strings';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source, { langCode, mergeLanguages, filters, } = {}) {
        let json = this.spreadsheetToJson.transform(source, { langCode });
        json = this.jsonToJsonMasked.transform(json, { filters });
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
