export default class MaskConverter {
  public convert(source: { [key: string]: any }, tags: { [key: string]: any }, meta: { [key: string]: any }): string {
    if (meta.locales) {
      // if the user has provided a locale, and locale is in filter, remove locale from filters
      if (meta.langCode && Object.keys(source).some((locale: string) => locale === meta.langCode)) {
        const { [meta.langCode]: underLocale, ...withoutLocale } = source as any;
        return this.convertMaskRecursively({ ...underLocale, ...withoutLocale }, tags);
      }
      // if user has not provided a locale, and locale is not in filter, add the filters to all locales
      if (!meta.langCode) {
        const newFilters = Object.keys(source).reduce((accumulator: any, key: string) => {
          if (meta.locales.some((locale: string) => locale === key)) {
            accumulator[key] = source[key];
          } else {
            meta.locales.reduce((innerAccumulator: any, locale: string) => {
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

  private convertMaskRecursively(source: { [key: string]: any }, tags: { [key: string]: any }): string {
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
