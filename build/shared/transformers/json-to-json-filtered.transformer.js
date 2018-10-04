"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonToJsonFilteredTransformer {
    constructor() {
        this.supportedType = 'json';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source, langCode, mergeLanguages, filter) {
        return source;
    }
}
exports.default = JsonToJsonFilteredTransformer;
