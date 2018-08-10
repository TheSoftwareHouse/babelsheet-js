"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FlatListToIosStringsTransformer {
    constructor() {
        this.supportedType = 'strings';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        return source.reduce((previous, translation) => `${previous}"${translation.name}" = "${translation.text || ''}";\n`, '');
    }
}
exports.default = FlatListToIosStringsTransformer;
