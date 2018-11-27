import { get } from 'dot-prop-immutable';

import * as gettextParser from 'gettext-parser';
import ITransofrmer, { ITranslationsData } from './transformer';

export default class JsonToPoTransformer implements ITransofrmer {
  private readonly supportedType = 'json-po';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    if (source.meta.langCode) {
      return {
        ...source,
        result: [
          {
            lang: source.meta.langCode,
            content: this.generatePo(
              source.result,
              source.meta.includeComments ? source.comments : undefined,
              source.meta.locales
            ),
          },
        ],
      };
    } else {
      return {
        ...source,
        result: Object.keys(source.result).map(lang => ({
          lang,
          content: this.generatePo(
            source.result[lang],
            source.meta.includeComments ? source.comments : undefined,
            source.meta.locales
          ),
        })),
      };
    }
  }

  public generatePo(json: object, comments: any, locales?: string[]) {
    const generateFlatListRecursive = (
      translations: object,
      accumulator: Array<{ [key: string]: string }>,
      keyList?: string[]
    ) => {
      Object.keys(translations).forEach(key => {
        const value = (translations as any)[key];
        const newKeyList = keyList ? [...keyList, key] : [key];

        if (value && typeof value === 'object') {
          generateFlatListRecursive(value, accumulator, newKeyList);
        } else {
          const newEntry = {
            msgid: newKeyList.join('.').toLowerCase(),
            msgstr: value,
          };
          if (comments) {
            (newEntry as any).comments = {
              translator: get(comments, newKeyList.join('.')),
            };
          }
          accumulator.push(newEntry);
        }
      });
      return accumulator;
    };

    const data = {
      charset: 'UTF-8',
      headers: {
        language: locales ? locales[0].substr(0, 2) : undefined,
        'content-type': 'text/plain; charset=UTF-8',
      },
      translations: [generateFlatListRecursive(json, [])],
    };

    return gettextParser.po.compile(data);
  }
}
