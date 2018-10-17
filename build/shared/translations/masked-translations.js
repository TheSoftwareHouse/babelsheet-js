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
    async getTranslations(filters, { keepLocale, comments } = {}) {
        const source = await this.storage.get(this.translationsKey);
        if (!source) {
            return Promise.reject(new not_found_1.default('Translations not found'));
        }
        const maskedTranslations = this.jsonToJsonMaskedTransformer.transform({
            ...source,
            meta: { ...source.meta, includeComments: comments, filters, mergeLanguages: true },
        });
        // if not keeping locales and there is only one key on the first level of result, and it can be found in locales list
        if (!keepLocale) {
            const keys = Object.keys(maskedTranslations.result);
            if (keys.length === 1 &&
                maskedTranslations.meta.locales &&
                maskedTranslations.meta.locales.some((locale) => locale === keys[0])) {
                return {
                    ...maskedTranslations,
                    result: maskedTranslations.result[keys[0]],
                    meta: { ...maskedTranslations.meta },
                };
            }
        }
        return maskedTranslations;
    }
}
exports.default = MaskedTranslations;
