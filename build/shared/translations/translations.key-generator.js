"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_version_suffix_1 = require("../get-version-suffix");
class TranslationsKeyGenerator {
    generateKey(prefix, filters, version, extension) {
        return `${prefix}-${filters.map(filter => filter.trim().toLowerCase()).join(',')}-${extension}${get_version_suffix_1.toSuffix(version)}`;
    }
}
exports.default = TranslationsKeyGenerator;
