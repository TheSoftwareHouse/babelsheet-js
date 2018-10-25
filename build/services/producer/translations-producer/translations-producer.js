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
        const transformedData = await this.transformer.transform({
            translations: {},
            meta: {
                mergeLanguages: true,
            },
            result: spreadsheetData,
        });
        const [, actualTranslations] = await await_to_js_1.default(this.translationsStorage.getTranslations([]));
        if (!ramda.equals(transformedData, actualTranslations)) {
            await this.translationsStorage.clearTranslations();
            await this.translationsStorage.setTranslations([], transformedData);
            this.logger.info('Translations were refreshed');
        }
    }
}
exports.default = TranslationsProducer;
