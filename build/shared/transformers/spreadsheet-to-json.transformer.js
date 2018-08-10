"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dot_prop_immutable_1 = require("dot-prop-immutable");
const ramda = require("ramda");
class SpreadsheetToJsonTransformer {
    constructor() {
        this.metaTranslationKey = '>>>';
        this.metaTagKey = '###';
        this.outputTagsKey = 'tags';
        this.supportedType = 'json-obj';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source, langCode) {
        const sourceValues = ramda.values(source);
        const metaIndex = sourceValues.findIndex(row => row.some(value => value === this.metaTranslationKey));
        if (metaIndex > -1) {
            const sourceRows = sourceValues.slice(metaIndex + 1, sourceValues.length);
            const meta = sourceValues[metaIndex];
            const translations = ramda.reduce((accRow, row) => {
                const context = this.updateContext(accRow.context, row, meta);
                const withTranslations = this.updateTranslations(accRow.result, context, row, meta);
                const result = this.updateTags(withTranslations, context, row, meta);
                return { result, context };
            }, { result: {}, context: '' }, sourceRows).result;
            if (langCode) {
                return this.getLanguageTranslations(translations, langCode);
            }
            return translations;
        }
        return {};
    }
    getLanguageTranslations(result, langCode) {
        const langCodeWithCase = Object.keys(result).find(key => key.toLowerCase() === langCode.toLowerCase());
        if (!langCodeWithCase) {
            throw new Error(`No translations for '${langCode}' language code`);
        }
        const languageTranslations = result[langCodeWithCase];
        return languageTranslations;
    }
    extractTags(source) {
        return source.split(',').map(value => value.trim());
    }
    valueHasLocale(value) {
        return value.length > 0 && value !== this.metaTagKey && value !== this.metaTranslationKey;
    }
    updateContext(context, row, meta) {
        return ramda.addIndex(ramda.reduce)((acc, element, index) => {
            if (element && index < meta.length && meta[index] === this.metaTranslationKey) {
                const contextSplit = acc.split('.');
                if (index > contextSplit.length) {
                    return `${acc}.${element}`;
                }
                else {
                    const slicedContext = contextSplit.slice(0, index - 1);
                    return slicedContext.length === 0 ? element : `${slicedContext.join('.')}.${element}`;
                }
            }
            return acc;
        }, context, row);
    }
    updateTranslations(source, context, row, meta) {
        return ramda.addIndex(ramda.reduce)((acc, element, index) => {
            if (element && index < meta.length && this.valueHasLocale(meta[index])) {
                return dot_prop_immutable_1.set(acc, `${meta[index]}.${context}`, element);
            }
            return acc;
        }, ramda.clone(source), row);
    }
    updateTags(source, context, row, meta) {
        return ramda.addIndex(ramda.reduce)((accRow, rowElement, rowIndex) => {
            if (rowElement && rowIndex < meta.length && meta[rowIndex] === this.metaTagKey) {
                return ramda.reduce((accTag, tag) => {
                    return dot_prop_immutable_1.set(accTag, `${this.outputTagsKey}.${tag}.${context}`, null);
                }, accRow, this.extractTags(rowElement));
            }
            return accRow;
        }, ramda.clone(source), row);
    }
}
exports.default = SpreadsheetToJsonTransformer;
