"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const await_to_js_1 = require("await-to-js");
const ramda = require("ramda");
class TranslationsProducer {
    constructor(logger, googleSheets, transformer, translationsStorage) {
        this.logger = logger;
        this.googleSheets = googleSheets;
        this.transformer = transformer;
        this.translationsStorage = translationsStorage;
    }
    async produce(authData) {
        const spreadsheetData = await this.googleSheets.fetchSpreadsheet(authData);
        const transformedSheets = await Object.keys(spreadsheetData).reduce(async (transformedTranslationsPromise, key) => {
            const values = spreadsheetData[key];
            if (!values) {
                return transformedTranslationsPromise;
            }
            const data = await this.transformer.transform({ translations: {}, meta: { mergeLanguages: true }, result: spreadsheetData[key] });
            const transformedTranslations = await transformedTranslationsPromise;
            transformedTranslations[key] = data;
            return transformedTranslationsPromise;
        }, Promise.resolve({}));
        for (const key of Object.keys(transformedSheets)) {
            const [, actualTranslations] = await await_to_js_1.default(this.translationsStorage.getTranslations([], key));
            if (!ramda.equals(transformedSheets[key], actualTranslations)) {
                await this.translationsStorage.clearTranslations(key);
                await this.translationsStorage.setTranslations([], transformedSheets[key], key);
                this.logger.info(`Translations (version ${key}) were refreshed`);
            }
        }
    }
}
exports.default = TranslationsProducer;
