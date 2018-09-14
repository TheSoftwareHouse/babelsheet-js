import * as xmlbuilder from 'xmlbuilder';
import ITransformer from './transformer';

export default class FlatListToXlfTransformer implements ITransformer {
  private readonly supportedType = 'flat-list-xlf';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: Array<{ [key: string]: string }>): string {
    return this.generateXlf(source);
  }

  private generateXlf(translations: Array<{ [key: string]: string }>): string {
    const xml = xmlbuilder
      .create('xliff')
      .att('version', '1.2')
      .att('xmlns', 'urn:oasis:names:tc:xliff:document:1.2');

    const body = xml.ele('file', { datatype: 'plaintext', 'source-language': 'en' }).ele('body');

    translations.forEach((translation: any) => {
      const keyWithDots = translation.name.replace(/_/g, '.');
      const transUnit = body.ele('trans-unit', { id: keyWithDots });
      transUnit.ele('source', keyWithDots);
      transUnit.ele('target', translation.text);
    });

    return xml.end({ pretty: true });
  }
}
