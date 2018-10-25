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
    transform(source) {
        const json = this.spreadsheetToJson.transform(source);
        const jsonMasked = this.jsonToJsonMasked.transform(json);
        return this.jsonToXlf.transform(jsonMasked);
    }
}
exports.default = SpreadsheetToXlfTransformer;
