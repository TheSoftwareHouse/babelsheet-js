"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gettext_parser_1 = require("gettext-parser");
class FlatListToPoTransformer {
    constructor() {
        this.supportedType = 'flat-list-po';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        if (source.meta.mergeLanguages) {
            throw new Error('Not possible to create merge translations for po format');
        }
        return {
            ...source,
            result: source.result.map(({ lang, content }) => ({
                lang,
                content: this.generatePo(lang, content, source.meta.includeComments),
            })),
        };
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
