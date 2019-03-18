"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const not_found_1 = require("../error/not-found");
const get_version_suffix_1 = require("../get-version-suffix");
class MaskedTranslations {
    constructor(storage, jsonToJsonMaskedTransformer) {
        this.storage = storage;
        this.jsonToJsonMaskedTransformer = jsonToJsonMaskedTransformer;
        this.translationsKey = 'translations';
    }
    async clearTranslations(version) {
        const key = this.translationsKey + get_version_suffix_1.toSuffix(version);
        return this.storage.clear(key);
    }
    async setTranslations(filters, translations, version) {
        return this.storage.set(this.translationsKey + get_version_suffix_1.toSuffix(version), translations);
    }
    async getTranslations(filters, version, { keepLocale, includeComments } = {}) {
        const source = await this.storage.get(this.translationsKey + get_version_suffix_1.toSuffix(version));
        if (!source) {
            return Promise.reject(new not_found_1.default('Translations not found'));
        }
        const maskedTranslations = this.jsonToJsonMaskedTransformer.transform({
            ...source,
            meta: { ...source.meta, includeComments, filters, mergeLanguages: true },
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
