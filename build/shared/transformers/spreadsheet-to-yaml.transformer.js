"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpreadsheetToYamlTransformer {
    constructor(spreadsheetToJson, jsonToYaml, jsonToJsonMasked) {
        this.spreadsheetToJson = spreadsheetToJson;
        this.jsonToYaml = jsonToYaml;
        this.jsonToJsonMasked = jsonToJsonMasked;
        this.supportedType = 'yml';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        const json = this.spreadsheetToJson.transform(source);
        const jsonMasked = this.jsonToJsonMasked.transform(json);
        return this.jsonToYaml.transform(jsonMasked);
    }
}
exports.default = SpreadsheetToYamlTransformer;
