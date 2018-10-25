"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mask = require("json-mask");
class JsonToJsonMaskedTransformer {
    constructor(maskInput, maskConverter) {
        this.maskInput = maskInput;
        this.maskConverter = maskConverter;
        this.supportedType = 'json';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        if (source.meta.filters && source.meta.filters.length) {
            const maskInput = this.maskInput.convert(source.meta.filters);
            const filtersMask = this.maskConverter.convert(maskInput, source.tags || {}, source.meta || {});
            const maskedTranslations = mask(source.result, filtersMask);
            return { ...source, result: maskedTranslations };
        }
        return source;
    }
}
exports.default = JsonToJsonMaskedTransformer;
