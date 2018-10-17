"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dot_prop_immutable_1 = require("dot-prop-immutable");
class JsonToFlatListTransformer {
    constructor() {
        this.supportedType = 'flat-list';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        const generateFlatListRecursive = (translations, sourceData, accumulator, keyList) => {
            Object.keys(translations).forEach(key => {
                const value = translations[key];
                const newKeyList = keyList ? [...keyList, key] : [key];
                if (value && typeof value === 'object') {
                    generateFlatListRecursive(value, sourceData, accumulator, newKeyList);
                }
                else {
                    // prepare new flat list entry
                    const newEntry = {
                        name: newKeyList.join('_').toLowerCase(),
                        text: value,
                    };
                    // add comment if any comment is found
                    if (source.meta.includeComments) {
                        const comment = dot_prop_immutable_1.get(sourceData.comments, this.prepareCommentsKey(newKeyList, sourceData.meta.locales));
                        if (comment) {
                            newEntry.comment = comment;
                        }
                    }
                    accumulator.push(newEntry);
                }
            });
            return accumulator;
        };
        if (source.meta.mergeLanguages) {
            return { ...source, result: { merged: generateFlatListRecursive(source.result, source, []) } };
        }
        if (source.meta.langCode) {
            return {
                ...source,
                result: [{ lang: source.meta.langCode, content: generateFlatListRecursive(source.result, source, []) }],
            };
        }
        return {
            ...source,
            result: Object.keys(source.result).map((locale) => ({
                lang: locale,
                content: generateFlatListRecursive(source.result[locale], source, []),
            })),
        };
    }
    prepareCommentsKey(keys, locales) {
        return locales && locales.some(locale => locale === keys[0]) ? keys.slice(1).join('.') : keys.join('.');
    }
}
exports.default = JsonToFlatListTransformer;
