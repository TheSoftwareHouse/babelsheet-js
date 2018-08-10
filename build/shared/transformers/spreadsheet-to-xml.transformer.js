"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpreadsheetToXmlTransformer {
    constructor(spreadsheetToJson, jsonToFlatList, flatListToXml) {
        this.spreadsheetToJson = spreadsheetToJson;
        this.jsonToFlatList = jsonToFlatList;
        this.flatListToXml = flatListToXml;
        this.supportedType = 'xml';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source, langCode) {
        const json = this.spreadsheetToJson.transform(source, langCode);
        const flatList = this.jsonToFlatList.transform(json);
        return this.flatListToXml.transform(flatList);
    }
}
exports.default = SpreadsheetToXmlTransformer;
