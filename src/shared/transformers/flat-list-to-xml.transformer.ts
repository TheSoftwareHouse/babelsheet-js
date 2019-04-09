import * as xmlbuilder from 'xmlbuilder';
import ITransformer, { ITranslationsData } from './transformer';

export default class FlatListToXmlTransformer implements ITransformer {
  private readonly supportedType = 'flat-list-xml';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    if (source.meta.mergeLanguages) {
      return {
        ...source,
        result: {
          merged: this.generateXml(source.result.merged, source.meta.includeComments),
        },
      };
    } else {
      return {
        ...source,
        result: source.result.map(({ lang, content }: { lang: any; content: any }) => ({
          lang,
          content: this.generateXml(content, source.meta.includeComments),
        })),
      };
    }
  }

  private generateXml(
    translations: Array<{ name: string; text: string; comment?: string }>,
    includeComments?: boolean
  ): string {
    const xml = xmlbuilder.create('resources');

    translations.forEach(result => {
      const element: { '@name': string; '#text': string } = { '@name': result.name, '#text': result.text };
      if (includeComments && result.comment) {
        return xml.ele({
          string: element,
          '#comment': result.comment,
        });
      }
      return xml.ele({
        string: element,
      });
    });

    return xml.end({ pretty: true });
  }
}
