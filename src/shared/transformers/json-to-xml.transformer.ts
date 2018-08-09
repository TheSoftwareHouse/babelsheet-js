import * as xmlbuilder from 'xmlbuilder';
import ITransformer from './transformer';

export default class JsonToXmlTransformer implements ITransformer {
  private readonly supportedType = 'json-xml';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: object): string {
    const translations = this.generateFlatTranslationsList(source);
    return this.generateXml(translations);
  }

  private generateFlatTranslationsList(source: object): Array<{ [key: string]: string }> {
    const result: Array<{ [key: string]: string }> = [];
    const generateFlatTranslationsRecursively = (translationsObj: object, current?: string) => {
      Object.keys(translationsObj).forEach(key => {
        const value = (translationsObj as any)[key];
        const newKey = current ? `${current}_${key}` : key;
        if (value && typeof value === 'object') {
          generateFlatTranslationsRecursively(value, newKey);
        } else {
          result.push({ name: newKey.toLowerCase(), text: value });
        }
      });
    };

    generateFlatTranslationsRecursively(source);
    return result;
  }

  private generateXml(translations: Array<{ [key: string]: string }>): string {
    const xml = xmlbuilder.create('resources');

    translations.forEach(translation => xml.ele('string', { name: translation.name }, translation.text));

    return xml.end();
  }
}
