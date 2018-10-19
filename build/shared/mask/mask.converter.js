"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MaskConverter {
    convert(source, tags, meta) {
        if (meta.locales) {
            // if the user has provided a locale, and locale is in filter, remove locale from filters
            if (meta.langCode && Object.keys(source).some((locale) => locale === meta.langCode)) {
                const { [meta.langCode]: underLocale, ...withoutLocale } = source;
                return this.convertMaskRecursively({ ...underLocale, ...withoutLocale }, tags);
            }
            // if user has not provided a locale, and locale is not in filter, add the filters to all locales
            if (!meta.langCode) {
                const newFilters = Object.keys(source).reduce((accumulator, key) => {
                    if (meta.locales.some((locale) => locale === key)) {
                        accumulator[key] = source[key];
                    }
                    else {
                        meta.locales.reduce((innerAccumulator, locale) => {
                            if (!innerAccumulator[locale]) {
                                innerAccumulator[locale] = {};
                            }
                            innerAccumulator[locale][key] = source[key];
                            return innerAccumulator;
                        }, accumulator);
                    }
                    return accumulator;
                }, {});
                return this.convertMaskRecursively(newFilters, tags);
            }
        }
        return this.convertMaskRecursively(source, tags || {});
    }
    convertMaskRecursively(source, tags) {
        if (source !== null) {
            return Object.keys(source)
                .map(key => {
                // every tag is on the first level of tags object, so if a key is a tag, this evaluates to truthy.
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
