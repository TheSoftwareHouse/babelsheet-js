"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmlbuilder = require("xmlbuilder");
class FlatListToXlfTransformer {
    constructor() {
        this.supportedType = 'flat-list-xlf';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        return this.generateXlf(source);
    }
    generateXlf(translations) {
        const xml = xmlbuilder
            .create('xliff')
            .att('version', '1.2')
            .att('xmlns', 'urn:oasis:names:tc:xliff:document:1.2');
        const body = xml.ele('file', { datatype: 'plaintext', 'source-language': 'en' }).ele('body');
        translations.forEach((translation) => {
            const keyWithDots = translation.name.replace(/_/g, '.');
            const transUnit = body.ele('trans-unit', { id: keyWithDots });
            transUnit.ele('source', keyWithDots);
            transUnit.ele('target', translation.text);
        });
        return xml.end({ pretty: true });
    }
}
exports.default = FlatListToXlfTransformer;
