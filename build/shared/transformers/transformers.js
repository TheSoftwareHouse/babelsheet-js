"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Transformers {
    constructor(transformers) {
        this.transformers = transformers;
    }
    async transform(data, type, langCode, mergeLanguages, filters) {
        const transformer = type && this.transformers.find(trans => trans.supports(type));
        if (!transformer) {
            throw new Error(`No support for ${type} data type`);
        }
        return await transformer.transform(data, langCode, mergeLanguages, filters);
    }
}
exports.default = Transformers;
