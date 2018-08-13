"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JsonToFlatListTransformer {
    constructor() {
        this.supportedType = 'flat-list';
    }
    supports(type) {
        return type.toLowerCase() === this.supportedType;
    }
    transform(source) {
        const result = [];
        const generateFlatListRecursively = (translationsObj, current) => {
            Object.keys(translationsObj).forEach(key => {
                const value = translationsObj[key];
                const newKey = current ? `${current}_${key}` : key;
                if (value && typeof value === 'object') {
                    generateFlatListRecursively(value, newKey);
                }
                else {
                    result.push({ name: newKey.toLowerCase(), text: value });
                }
            });
        };
        generateFlatListRecursively(source);
        return result;
    }
}
exports.default = JsonToFlatListTransformer;
