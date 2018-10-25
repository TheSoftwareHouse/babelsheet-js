"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChainTransformer {
    constructor(supportedType, transformers) {
        this.supportedType = supportedType;
        this.transformers = transformers;
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        return this.transformers.reduce((result, transformer) => transformer.transform(result), source);
    }
}
exports.default = ChainTransformer;
