"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda = require("ramda");
const not_found_1 = require("../error/not-found");
const formatToExtensions_1 = require("../formatToExtensions");
class CachedTranslations {
    constructor(storage, translationsKeyGenerator, maskedTranslations, transformers) {
        this.storage = storage;
        this.translationsKeyGenerator = translationsKeyGenerator;
        this.maskedTranslations = maskedTranslations;
        this.transformers = transformers;
        this.translationsCachePrefix = 'translationsCache';
    }
    async clearTranslations() {
        return this.storage.clear();
    }
    async setTranslations(filters, translations, version, format, keepLocale, includeComments) {
        const translationsKey = this.translationsKeyGenerator.generateKey(this.translationsCachePrefix, filters, version, format, keepLocale, includeComments);
        return this.storage.set(translationsKey, translations);
    }
    async getTranslations(filters, version, { format, keepLocale, includeComments }) {
        const extension = formatToExtensions_1.getExtensionsFromJson(format);
        const translationsKey = this.translationsKeyGenerator.generateKey(this.translationsCachePrefix, filters, version, format, keepLocale, includeComments);
        if (await this.storage.has(translationsKey)) {
            return await this.storage.get(translationsKey);
        }
        return this.maskedTranslations.getTranslations(filters, version, { keepLocale, includeComments }).then(async (trans) => {
            if (ramda.isEmpty(trans)) {
                return Promise.reject(new not_found_1.default('Translations not found'));
            }
            const transformedTranslations = await this.transformers.transform(trans, extension);
            await this.storage.set(translationsKey, transformedTranslations);
            return transformedTranslations;
        });
    }
}
exports.default = CachedTranslations;
