"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda = require("ramda");
const not_found_1 = require("../error/not-found");
class CachedTranslations {
    constructor(storage, translationsKeyGenerator, maskedTranslations) {
        this.storage = storage;
        this.translationsKeyGenerator = translationsKeyGenerator;
        this.maskedTranslations = maskedTranslations;
        this.translationsCachePrefix = 'translationsCache';
    }
    async hasTranslations(filters) {
        const translationsKey = this.translationsKeyGenerator.generateKey(this.translationsCachePrefix, filters);
        return this.storage.has(translationsKey);
    }
    async clearTranslations() {
        return this.storage.clear();
    }
    async setTranslations(filters, translations) {
        const translationsKey = this.translationsKeyGenerator.generateKey(this.translationsCachePrefix, filters);
        return this.storage.set(translationsKey, translations);
    }
    async getTranslations(filters) {
        const translationsKey = this.translationsKeyGenerator.generateKey(this.translationsCachePrefix, filters);
        if (await this.storage.has(translationsKey)) {
            return this.storage.get(translationsKey);
        }
        return this.maskedTranslations.getTranslations(filters).then(async (trans) => {
            if (ramda.isEmpty(trans)) {
                return Promise.reject(new not_found_1.default('Translations not found'));
            }
            await this.storage.set(translationsKey, trans);
            return trans;
        });
    }
}
exports.default = CachedTranslations;
