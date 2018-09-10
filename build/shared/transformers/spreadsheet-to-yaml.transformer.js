"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpreadsheetToYamlTransformer {
    constructor(spreadsheetToJson, jsonToYaml) {
        this.spreadsheetToJson = spreadsheetToJson;
        this.jsonToYaml = jsonToYaml;
        this.supportedType = 'yaml';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source, langCode, mergeLanguages) {
        const json = this.spreadsheetToJson.transform(source, langCode);
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
