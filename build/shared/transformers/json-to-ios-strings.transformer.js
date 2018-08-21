"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonToIosStringsTransformer {
    constructor(jsonToFlatList, flatListToIosStrings) {
        this.jsonToFlatList = jsonToFlatList;
        this.flatListToIosStrings = flatListToIosStrings;
        this.supportedType = 'json-ios-strings';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        const flatList = this.jsonToFlatList.transform(source);
        return this.flatListToIosStrings.transform(flatList);
    }
}
exports.default = JsonToIosStringsTransformer;
