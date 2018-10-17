import * as xmlbuilder from 'xmlbuilder';
import ITransformer, { ITranslationsData } from './transformer';

export default class FlatListToXlfTransformer implements ITransformer {
  private readonly supportedType = 'flat-list-xlf';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    if (source.meta.mergeLanguages) {
      return {
        ...source,
        result: {
          merged: this.generateXlf(source.result.merged, source.meta.includeComments),
        },
      };
    } else {
      return {
        ...source,
        result: source.result.map(({ lang, content }: { lang: any; content: any }) => ({
          lang,
          content: this.generateXlf(content, source.meta.includeComments),
        })),
      };
    }
  }

  private generateXlf(
    source: Array<{ name: string; text: string; comment?: string }>,
    includeComments?: boolean
  ): string {
    const xml = xmlbuilder
      .create('xliff')
      .att('version', '1.2')
      .att('xmlns', 'urn:oasis:names:tc:xliff:document:1.2');

    const body = xml.ele('file', { datatype: 'plaintext', 'source-language': 'en' }).ele('body');

    source.forEach(translation => {
      const keyWithDots = translation.name.replace(/_/g, '.');
      const transUnit = body.ele('trans-unit', { id: keyWithDots });
      transUnit.ele('source', keyWithDots);
      transUnit.ele('target', translation.text);
      if (includeComments && translation.comment) {
        transUnit.ele('note', translation.comment);
      }
    });

    return xml.end({ pretty: true });
  }
}
