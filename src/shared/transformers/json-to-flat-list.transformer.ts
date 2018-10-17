import { get } from 'dot-prop-immutable';
import ITransformer, { ITranslationsData, TranslationsDataNode } from './transformer';

export default class JsonToFlatListTransformer implements ITransformer {
  private readonly supportedType = 'flat-list';
  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    const generateFlatListRecursive = (
      translations: TranslationsDataNode,
      sourceData: ITranslationsData,
      accumulator: Array<{ [key: string]: string }>,
      keyList?: string[]
    ) => {
      Object.keys(translations).forEach(key => {
        const value = (translations as any)[key];
        const newKeyList = keyList ? [...keyList, key] : [key];

        if (value && typeof value === 'object') {
          generateFlatListRecursive(value, sourceData, accumulator, newKeyList);
        } else {
          // prepare new flat list entry
          const newEntry = {
            name: newKeyList.join('_').toLowerCase(),
            text: value,
          };
          // add comment if any comment is found
          if (source.meta.includeComments) {
            const comment = get(sourceData.comments, this.prepareCommentsKey(newKeyList, sourceData.meta.locales));
            if (comment) {
              (newEntry as any).comment = comment;
            }
          }

          accumulator.push(newEntry);
        }
      });
      return accumulator;
    };
    if (source.meta.mergeLanguages) {
      return { ...source, result: { merged: generateFlatListRecursive(source.result, source, []) } };
    }
    if (source.meta.langCode) {
      return {
        ...source,
        result: [{ lang: source.meta.langCode, content: generateFlatListRecursive(source.result, source, []) }],
      };
    }
    return {
      ...source,
      result: Object.keys(source.result).map((locale: string) => ({
        lang: locale,
        content: generateFlatListRecursive(source.result[locale], source, []),
      })),
    };
  }
  private prepareCommentsKey(keys: string[], locales?: string[]): string {
    return locales && locales.some(locale => locale === keys[0]) ? keys.slice(1).join('.') : keys.join('.');
  }
}
