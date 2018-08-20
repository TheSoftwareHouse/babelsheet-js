"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mask = require("json-mask");
const not_found_1 = require("../error/not-found");
class MaskedTranslations {
    constructor(storage, maskInput, maskConverter) {
        this.storage = storage;
        this.maskInput = maskInput;
        this.maskConverter = maskConverter;
        this.translationsKey = 'translations';
    }
    async clearTranslations() {
        return this.storage.clear();
    }
    async setTranslations(filters, translations) {
        return this.storage.set(this.translationsKey, translations);
    }
    async getTranslations(filters) {
        const translationsWithTags = await this.storage.get(this.translationsKey);
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
