import { po } from 'gettext-parser';
import ITransformer, { ITranslationsData } from './transformer';

export default class FlatListToPoTransformer implements ITransformer {
  private readonly supportedType = 'flat-list-po';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
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
