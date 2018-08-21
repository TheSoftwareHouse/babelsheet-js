"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatToExtension = {
    android: 'xml',
    ios: 'strings',
    json: 'json',
};
function getExtension(format) {
    const extension = formatToExtension[format];
    if (!extension) {
        throw new Error(`Not possible to create translations for format '${format}'`);
    }
    return extension;
}
exports.getExtension = getExtension;
const extensionsFromJson = {
    android: { extension: 'json-xml', documentType: 'application/xml' },
    ios: { extension: 'json-ios-strings', documentType: 'text/plain' },
    json: { extension: 'json', documentType: 'application/json' },
};
function getExtensionsFromJson(format) {
    const details = extensionsFromJson[format];
    if (!details) {
        throw new Error(`Not possible to create translations for format '${format}'`);
    }
    return details.extension;
}
exports.getExtensionsFromJson = getExtensionsFromJson;
function getDocumentType(format) {
    const details = extensionsFromJson[format];
    if (!details) {
        throw new Error(`Not possible to create translations for format '${format}'`);
    }
    return details.documentType;
}
exports.getDocumentType = getDocumentType;
