import { po } from 'gettext-parser';
import ITransformer, { ITranslationsData } from './transformer';

export default class FlatListToPoTransformer implements ITransformer {
  private static checkIfSingleLanguageRequested(meta: ITranslationsData['meta']) {
    if (!meta.filters || !meta.locales) {
      return true;
    }

    const filtersPrefixes = meta.filters.map((filter: string) => filter.split('.')[0]);
    const filtersLangPrefixes = filtersPrefixes.filter(prefix => meta.locales && meta.locales.includes(prefix));
    const filtersHasSameLangPrefix = filtersLangPrefixes.every((code, i, list) => code === list[0]);

    return filtersLangPrefixes.length > 0 && filtersHasSameLangPrefix;
  }

  private readonly supportedType = 'flat-list-po';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    if (!FlatListToPoTransformer.checkIfSingleLanguageRequested(source.meta)) {
      throw Error('PO files support only single language. Please use filters with one lang code');
    }

    if (source.meta.mergeLanguages) {
      const result = this.generatePo('', source.result.merged, source.meta.includeComments);
      return {
        ...source,
        result: {
          merged: result,
        },
      };
    } else {
      return {
        ...source,
        result: source.result.map(({ lang, content }: { lang: any; content: any }) => ({
          lang,
          content: this.generatePo(lang, content, source.meta.includeComments),
        })),
      };
    }
  }

  private generatePo(
    lang: string,
    source: Array<{ name: string; text: string; comment?: string }>,
    includeComments?: boolean
  ): string {
    const generatePoTranslate = (translations: object) => {
      const accumulator: Array<{ [key: string]: string }> = [];

      source.forEach(translation => {
        const newEntry = {
          msgid: translation.name,
          msgstr: translation.text,
        };
        if (includeComments && typeof translation.comment !== 'undefined') {
          (newEntry as any).comments = {
            translator: translation.comment,
          };
        }
        accumulator.push(newEntry);
      });

      return accumulator;
    };

    const data = {
      charset: 'UTF-8',
      headers: {
        language: lang ? lang.substr(0, 2) : undefined,
        'content-type': 'text/plain; charset=UTF-8',
      },
      translations: [generatePoTranslate(source)],
    };

    return po.compile(data).toString();
  }
}
