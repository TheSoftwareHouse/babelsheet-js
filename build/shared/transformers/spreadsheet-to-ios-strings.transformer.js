"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpreadsheetToIosStringsTransformer {
    constructor(spreadsheetToJson, jsonToFlatList, flatListToIosStrings) {
        this.spreadsheetToJson = spreadsheetToJson;
        this.jsonToFlatList = jsonToFlatList;
        this.flatListToIosStrings = flatListToIosStrings;
        this.supportedType = 'strings';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source, langCode) {
        const json = this.spreadsheetToJson.transform(source, langCode);
        const flatList = this.jsonToFlatList.transform(json);
        return this.flatListToIosStrings.transform(flatList);
    }
}
exports.default = SpreadsheetToIosStringsTransformer;
