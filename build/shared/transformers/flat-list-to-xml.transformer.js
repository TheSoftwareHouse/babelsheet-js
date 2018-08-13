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
        return this.generateXml(source);
    }
    generateXml(translations) {
        const xml = xmlbuilder.create('resources');
        translations.forEach(translation => xml.ele('string', { name: translation.name }, translation.text));
        return xml.end();
    }
}
exports.default = FlatListToXmlTransformer;
