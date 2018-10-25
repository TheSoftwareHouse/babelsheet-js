"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TranslationsKeyGenerator {
    generateKey(prefix, filters, extension, keepLocale, comments) {
        return `${prefix}-${filters.map(filter => filter.trim().toLowerCase()).join(',')}-${extension}-${keepLocale ? 1 : 0}-${comments ? 1 : 0}`;
    }
}
exports.default = TranslationsKeyGenerator;
