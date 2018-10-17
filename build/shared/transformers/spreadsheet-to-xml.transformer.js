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
    transform(source) {
        const json = this.spreadsheetToJson.transform(source);
        const jsonMasked = this.jsonToJsonMasked.transform(json);
        return this.jsonToXml.transform(jsonMasked);
    }
}
exports.default = SpreadsheetToXmlTransformer;
