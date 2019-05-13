"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gettext_parser_1 = require("gettext-parser");
class FlatListToPoTransformer {
    constructor() {
        this.supportedType = 'flat-list-po';
    }
    static checkIfSingleLanguageRequested(meta) {
        if (!meta.filters || !meta.locales) {
            return true;
        }
        const filtersPrefixes = meta.filters.map((filter) => filter.split('.')[0]);
        const filtersLangPrefixes = filtersPrefixes.filter((prefix) => meta.locales && meta.locales.includes(prefix));
        const filtersHasSameLangPrefix = filtersLangPrefixes.every((code, i, list) => code === list[0]);
        return filtersLangPrefixes.length > 0 && filtersHasSameLangPrefix;
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        if (!FlatListToPoTransformer.checkIfSingleLanguageRequested(source.meta)) {
            throw Error("PO files support only single language. Please use filters with one lang code");
        }
        if (source.meta.mergeLanguages) {
            const result = this.generatePo('', source.result.merged, source.meta.includeComments);
            return {
                ...source,
                result: {
                    merged: result,
                },
            };
        }
        else {
            return {
                ...source,
                result: source.result.map(({ lang, content }) => ({
                    lang,
                    content: this.generatePo(lang, content, source.meta.includeComments),
                })),
            };
        }
    }
    generatePo(lang, source, includeComments) {
        const generatePoTranslate = (translations) => {
            const accumulator = [];
            source.forEach(translation => {
                const newEntry = {
                    msgid: translation.name,
                    msgstr: translation.text,
                };
                if (includeComments && typeof translation.comment !== 'undefined') {
                    newEntry.comments = {
                        translator: translation.comment,
                    };
                }
                accumulator.push(newEntry);
            });
            return accumulator;
        };
        const data = {
            charset: 'UTF-8',
            headers: {
                language: lang ? lang.substr(0, 2) : undefined,
                'content-type': 'text/plain; charset=UTF-8',
            },
            translations: [generatePoTranslate(source)],
        };
        return gettext_parser_1.po.compile(data).toString();
    }
}
exports.default = FlatListToPoTransformer;
