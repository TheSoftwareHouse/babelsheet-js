"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonToXlfTransformer {
    constructor(jsonToFlatList, flatListToXlf) {
        this.jsonToFlatList = jsonToFlatList;
        this.flatListToXlf = flatListToXlf;
        this.supportedType = 'json-xlf';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        const flatList = this.jsonToFlatList.transform(source);
        return this.flatListToXlf.transform(flatList);
    }
}
exports.default = JsonToXlfTransformer;
