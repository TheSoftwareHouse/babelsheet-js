"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const not_found_1 = require("../error/not-found");
class MaskedTranslations {
    constructor(storage, jsonToJsonMaskedTransformer) {
        this.storage = storage;
        this.jsonToJsonMaskedTransformer = jsonToJsonMaskedTransformer;
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
        const maskedTranslations = this.jsonToJsonMaskedTransformer.transform(translationsWithTags, { filters });
        return Promise.resolve(maskedTranslations);
    }
}
exports.default = MaskedTranslations;
