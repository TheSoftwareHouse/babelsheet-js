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
    //object with en and proper translations
    //const baseTranslations = baseWithTranslations.base;
    //const translations = baseWithTranslations.translations;
    const xml = xmlbuilder
      .create('xliff')
      .att('xmlns', 'urn:oasis:names:tc:xliff:document:1.2')
      .att('version', '1.2');

    const body = xml.ele('file', { 'source-language': 'en', datatype: 'plaintext' }).ele('body');

    translations.forEach((translation: any) => {
      const transUnit = body.ele('trans-unit', { id: translation.name });
      //transUnit.ele('source', baseTranslations[translation.name]);
      transUnit.ele('target', translation.text);
    });

    return xml.end({ pretty: true });
  }
}
