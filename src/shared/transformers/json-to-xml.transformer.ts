import * as xmlbuilder from 'xmlbuilder';
import ITransformer from './transformer';

export default class JsonToXmlTransformer implements ITransformer {
  private readonly supportedType = 'json-xml';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: object): string {
    const translations = this.generateDotNotationList(source);
    return this.generateXml(translations);
  }

  private generateDotNotationList(source: object): Array<{ [key: string]: string }> {
    const result: Array<{ [key: string]: string }> = [];
    const generateDotNotationRecursively = (translationsObj: object, current?: string) => {
      Object.keys(translationsObj).forEach(key => {
        const value = (translationsObj as any)[key];
        const newKey = current ? `${current}.${key}` : key;
        if (value && typeof value === 'object') {
          generateDotNotationRecursively(value, newKey);
        } else {
          result.push({ name: newKey, text: value });
        }
      });
    };

    generateDotNotationRecursively(source);
    return result;
  }

  private generateXml(translations: Array<{ [key: string]: string }>): string {
    const xml = xmlbuilder.create('resources');

    translations.forEach(translation => xml.ele('string', { name: translation.name }, translation.text));

    return xml.end();
  }
}
