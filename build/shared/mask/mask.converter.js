"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MaskConverter {
    convert(source, tags) {
        return this.convertMaskRecursively(source, tags || {});
    }
    convertMaskRecursively(source, tags) {
        if (source !== null) {
            return Object.keys(source)
                .map(key => {
                if (tags[key]) {
                    return this.convertMaskRecursively(tags[key], tags);
                }
                const maskForKey = this.convertMaskRecursively(source[key], tags);
                return maskForKey ? `${key}(${maskForKey})` : `${key}`;
            })
                .join(',');
        }
        return '';
    }
}
exports.default = MaskConverter;
