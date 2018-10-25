"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmlbuilder = require("xmlbuilder");
class FlatListToXmlTransformer {
    constructor() {
        this.supportedType = 'flat-list-xml';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        if (source.meta.mergeLanguages) {
            return {
                ...source,
                result: {
                    merged: this.generateXml(source.result.merged, source.meta.includeComments),
                },
            };
        }
        else {
            return {
                ...source,
                result: source.result.map(({ lang, content }) => ({
                    lang,
                    content: this.generateXml(content, source.meta.includeComments),
                })),
            };
        }
    }
    generateXml(translations, includeComments) {
        const xml = xmlbuilder.create('resources');
        translations.forEach(result => {
            const element = { '@name': result.name, '#text': result.text };
            if (result.comment) {
                return xml.ele({
                    string: element,
                    '#comment': result.comment,
                });
            }
            return xml.ele({
                string: element,
            });
        });
        return xml.end({ pretty: true });
    }
}
exports.default = FlatListToXmlTransformer;
