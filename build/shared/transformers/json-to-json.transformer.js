"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonToJsonTransformer {
    constructor() {
        this.supportedType = 'json';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        return source;
    }
}
exports.default = JsonToJsonTransformer;
