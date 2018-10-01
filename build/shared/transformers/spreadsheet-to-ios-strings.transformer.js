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
        const json = this.spreadsheetToJson.transform(source, { langCode });
        const jsonMasked = this.jsonToJsonMasked.transform(json, { filters });
        if (mergeLanguages || langCode) {
            return this.jsonToIosStrings.transform(jsonMasked);
        }
        return Object.keys(jsonMasked).map(langName => {
            const iosStrings = this.jsonToIosStrings.transform(jsonMasked[langName]);
            return { lang: langName, content: iosStrings };
        });
    }
}
exports.default = SpreadsheetToIosStringsTransformer;
