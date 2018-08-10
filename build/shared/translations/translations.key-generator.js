"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TranslationsKeyGenerator {
    generateKey(prefix, filters) {
        return `${prefix}-${filters.map(filter => filter.trim().toLowerCase()).join(',')}`;
    }
}
exports.default = TranslationsKeyGenerator;
