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
        let json = this.spreadsheetToJson.transform(source, { langCode });
        json = this.jsonToJsonMasked.transform(json, { filters });
        if (mergeLanguages || langCode) {
            return this.jsonToYaml.transform(json);
        }
        return Object.keys(json).map(langName => {
            const yamlTranslations = this.jsonToYaml.transform(json[langName]);
            return { lang: langName, content: yamlTranslations };
        });
    }
}
exports.default = SpreadsheetToYamlTransformer;
