import * as xmlbuilder from 'xmlbuilder';
import ITransformer from './transformer';

export default class FlatListToXmlTransformer implements ITransformer {
  private readonly supportedType = 'flat-list-xml';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: Array<{ [key: string]: string }>): string {
    return this.generateXml(source);
  }

  private generateXml(translations: Array<{ [key: string]: string }>): string {
    const xml = xmlbuilder.create('resources');

    translations.forEach(translation => xml.ele('string', { name: translation.name }, translation.text));

    return xml.end();
  }
}
