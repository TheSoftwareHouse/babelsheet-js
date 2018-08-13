"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Transformers {
    constructor(transformers) {
        this.transformers = transformers;
    }
    async transform(data, type, langCode) {
        const transformer = this.transformers.find(trans => trans.supports(type));
        if (!transformer) {
            throw new Error(`No support for ${type} data type`);
        }
        return await transformer.transform(data, langCode);
    }
}
exports.default = Transformers;
