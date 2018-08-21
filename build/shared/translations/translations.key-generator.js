"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TranslationsKeyGenerator {
    generateKey(prefix, filters, extension) {
        return `${prefix}-${filters.map(filter => filter.trim().toLowerCase()).join(',')}-${extension}`;
    }
}
exports.default = TranslationsKeyGenerator;
