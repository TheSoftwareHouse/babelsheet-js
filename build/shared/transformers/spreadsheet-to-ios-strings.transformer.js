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
    transform(source) {
        const json = this.spreadsheetToJson.transform(source);
        const jsonMasked = this.jsonToJsonMasked.transform(json);
        if (source.meta.mergeLanguages) {
            return this.jsonToIosStrings.transform(jsonMasked);
        }
        return this.jsonToIosStrings.transform(jsonMasked);
    }
}
exports.default = SpreadsheetToIosStringsTransformer;
