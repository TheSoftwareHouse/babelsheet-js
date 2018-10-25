"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dot_prop_immutable_1 = require("dot-prop-immutable");
const ramda = require("ramda");
class SpreadsheetToJsonTransformer {
    constructor() {
        this.metaTranslationKey = '>>>';
        this.metaTagKey = '###';
        this.outputTagsKey = 'tags';
        this.outputTranslationsKey = 'translations';
        this.metaCommentsKey = '$$$';
        this.outputCommentsKey = 'comments';
        this.supportedType = 'json-obj';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        // find the meta info row (information about colums purpose)
        const metaIndex = source.result.findIndex((row) => row.some(value => value === this.metaTranslationKey));
        if (metaIndex > -1) {
            // parse data only after the meta info row
            const sourceRows = source.result.slice(metaIndex + 1, source.result.length);
            const meta = source.result[metaIndex];
            const metaInfo = {
                translationKeysStartIndex: meta.findIndex((element) => element === this.metaTranslationKey),
            };
            const parsed = ramda.reduce((accRow, row) => {
                const context = this.updateContext(accRow.context, row, meta, metaInfo);
                const withTranslations = this.updateTranslations(accRow.translationsData, context, row, meta);
                const withTags = this.updateTags(withTranslations, context, row, meta);
                const translationsData = this.updateComments(withTags, context, row, meta);
                return { translationsData, context };
            }, { translationsData: {}, context: '' }, sourceRows).translationsData;
            const locales = meta.filter((key) => this.valueHasLocale(key));
            const result = {
                ...source,
                ...parsed,
                meta: {
                    ...source.meta,
                    locales,
                },
                result: parsed[this.outputTranslationsKey],
            };
            if (source.meta.langCode) {
                return this.getLanguageTranslations(result, source.meta.langCode);
            }
            return result;
        }
        return {
            translations: {},
            result: {},
            meta: {},
        };
    }
    getLanguageTranslations(result, langCode) {
        const langCodeWithCase = result[this.outputTranslationsKey] &&
            Object.keys(result[this.outputTranslationsKey]).find(key => key.toLowerCase() === langCode.toLowerCase());
        if (!langCodeWithCase) {
            throw new Error(`No translations for '${langCode}' language code`);
        }
        const languageTranslations = ramda.clone(result);
        languageTranslations.result = result[this.outputTranslationsKey][langCodeWithCase];
        return languageTranslations;
    }
    extractTags(source) {
        return source.split(',').map(value => value.trim());
    }
    valueHasLocale(value) {
        return (value.length > 0 &&
            value !== this.metaTagKey &&
            value !== this.metaCommentsKey &&
            value !== this.metaTranslationKey);
    }
    updateContext(context, row, meta, { translationKeysStartIndex }) {
        return ramda.addIndex(ramda.reduce)((acc, element, index) => {
            // each row has a single element in the translation keys columns, and the content is divided into rows.
            // The nested keys need to be taken into account - they are passed as "context".
            if (element && index < meta.length && meta[index] === this.metaTranslationKey) {
                // if an element is found in the translation keys column, it needs to be added to the existing context.
                // if it is deeper than existing context it needs to be added, or replaced otherwise.
                // contextSplit has length 1 when no context is defined ("".split(".") results in [""])
                // index takes into account the columns preceding translation keys columns, so it needs to be adjusted
                const contextSplit = acc.split('.');
                if (index - translationKeysStartIndex + 1 > contextSplit.length) {
                    return `${acc}.${element}`;
                }
                else {
                    const slicedContext = contextSplit.slice(0, index - translationKeysStartIndex);
                    return slicedContext.length === 0 ? element : `${slicedContext.join('.')}.${element}`;
                }
            }
            // return the new context.
            // TODO: maybe this could be shortcut'ed with https://ramdajs.com/docs/#reduced
            return acc;
        }, context, row);
    }
    updateTranslations(source, context, row, meta) {
        return ramda.addIndex(ramda.reduce)((acc, element, index) => {
            // meta row has locale name at the translated value index. The locale is used as the first key part of the parsed data, and put into the data object
            if (element && index < meta.length && this.valueHasLocale(meta[index])) {
                return dot_prop_immutable_1.set(acc, `${this.outputTranslationsKey}.${meta[index]}.${context}`, element);
            }
            return acc;
        }, ramda.clone(source), row);
    }
    updateTags(source, context, row, meta) {
        return ramda.addIndex(ramda.reduce)((accRow, rowElement, rowIndex) => {
            // if the row has any data in the tags column, add it to the output object under tags key
            if (rowElement && rowIndex < meta.length && meta[rowIndex] === this.metaTagKey) {
                return ramda.reduce((accTag, tag) => {
                    return dot_prop_immutable_1.set(accTag, `${this.outputTagsKey}.${tag}.${context}`, null);
                }, accRow, this.extractTags(rowElement));
            }
            return accRow;
        }, ramda.clone(source), row);
    }
    updateComments(source, context, row, meta) {
        return ramda.addIndex(ramda.reduce)((accRow, rowElement, rowIndex) => {
            // if the row has any data in the comments column, add it to the output object under comments key
            if (rowElement && rowIndex < meta.length && meta[rowIndex] === this.metaCommentsKey) {
                return dot_prop_immutable_1.set(accRow, `${this.outputCommentsKey}.${context}`, rowElement);
            }
            return accRow;
        }, ramda.clone(source), row);
    }
}
exports.default = SpreadsheetToJsonTransformer;
