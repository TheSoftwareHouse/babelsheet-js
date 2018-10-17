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
    transform(source) {
        const json = this.spreadsheetToJson.transform(source);
        const jsonMasked = this.jsonToJsonMasked.transform(json);
        if (source.meta.mergeLanguages) {
            return { ...jsonMasked, result: JSON.stringify(jsonMasked.result) };
        }
        return {
            ...jsonMasked,
            result: Object.keys(jsonMasked.result).map(langName => ({
                lang: langName,
                content: JSON.stringify(jsonMasked.result[langName]),
            })),
        };
    }
}
exports.default = SpreadsheetToJsonStringTransformer;
