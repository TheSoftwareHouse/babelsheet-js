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
    transform(source, { langCode, mergeLanguages, filters, } = {}) {
        const json = this.spreadsheetToJson.transform(source, { langCode });
        const jsonMasked = this.jsonToJsonMasked.transform(json, { filters });
        if (mergeLanguages || langCode) {
            return this.jsonToYaml.transform(jsonMasked);
        }
        return Object.keys(jsonMasked).map(langName => {
            const yamlTranslations = this.jsonToYaml.transform(jsonMasked[langName]);
            return { lang: langName, content: yamlTranslations };
        });
    }
}
exports.default = SpreadsheetToYamlTransformer;
