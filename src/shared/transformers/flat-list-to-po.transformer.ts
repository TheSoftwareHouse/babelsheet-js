import * as gettextParser from 'gettext-parser';
import ITransformer, { ITranslationsData } from './transformer';

export default class FlatListToPoTransformer implements ITransformer {
  private readonly supportedType = 'flat-list-xlf';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    if (source.meta.mergeLanguages) {
      return {
        ...source,
        result: {
          merged: this.generatePo('pl', source.result.merged, source.meta.includeComments),
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
        if (typeof translation.comment !== 'undefined') {
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

    return gettextParser.po.compile(data);
  }
}
