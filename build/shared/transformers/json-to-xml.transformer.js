"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonToXmlTransformer {
    constructor(jsonToFlatList, flatListToXml) {
        this.jsonToFlatList = jsonToFlatList;
        this.flatListToXml = flatListToXml;
        this.supportedType = 'json-xml';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        const flatList = this.jsonToFlatList.transform(source);
        return this.flatListToXml.transform(flatList);
    }
}
exports.default = JsonToXmlTransformer;
