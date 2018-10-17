"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FlatListToIosStringsTransformer {
    constructor() {
        this.supportedType = 'flat-list-strings';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        if (source.meta.mergeLanguages) {
            return {
                ...source,
                result: {
                    merged: this.generateIosStrings(source.result.merged, source.meta.includeComments),
                },
            };
        }
        else {
            return {
                ...source,
                result: source.result.map(({ lang, content }) => ({
                    lang,
                    content: this.generateIosStrings(content, source.meta.includeComments),
                })),
            };
        }
    }
    generateIosStrings(source, includeComments) {
        return source.reduce((previous, element) => includeComments && element.comment
            ? `${previous}/* Note = "${element.comment}"; */\n"${element.name}" = "${element.text || ''}";\n`
            : `${previous}"${element.name}" = "${element.text || ''}";\n`, '');
    }
}
exports.default = FlatListToIosStringsTransformer;
