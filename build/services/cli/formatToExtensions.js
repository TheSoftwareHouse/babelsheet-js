"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatToExtension = {
    json: 'json',
    xml: 'xml',
    android: 'xml',
    ios: 'strings',
};
function getExtension(format) {
    const extension = formatToExtension[format];
    if (!extension) {
        throw new Error(`Not possible to create translations for format '${format}'`);
    }
    return extension;
}
exports.getExtension = getExtension;
