"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mask = require("json-mask");
const not_found_1 = require("../error/not-found");
const get_version_suffix_1 = require("../get-version-suffix");
class MaskedTranslations {
    constructor(storage, maskInput, maskConverter) {
        this.storage = storage;
        this.maskInput = maskInput;
        this.maskConverter = maskConverter;
        this.translationsKey = 'translations';
    }
    async clearTranslations(version) {
        const key = this.translationsKey + get_version_suffix_1.toSuffix(version);
        return this.storage.clear(key);
    }
    async setTranslations(filters, translations, version) {
        return this.storage.set(this.translationsKey + get_version_suffix_1.toSuffix(version), translations);
    }
    async getTranslations(filters, version, format) {
        const translationsWithTags = await this.storage.get(this.translationsKey + get_version_suffix_1.toSuffix(version));
        if (!translationsWithTags) {
            return Promise.reject(new not_found_1.default('Translations not found'));
        }
        const { tags, ...translations } = translationsWithTags;
        const maskInput = this.maskInput.convert(filters);
        const filtersMask = this.maskConverter.convert(maskInput, tags);
        const maskedTranslations = mask(translations, filtersMask);
        return Promise.resolve(maskedTranslations);
    }
}
exports.default = MaskedTranslations;
