import ITransformer from './transformer';

export default class SpreadsheetToXmlTransformer implements ITransformer {
  private readonly supportedType = 'xml';

  constructor(private spreadsheetToJson: ITransformer, private jsonToXml: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(
    source: { [key: string]: string[] },
    langCode?: string,
    mergeLanguages?: boolean
  ): string | object[] {
    const json = this.spreadsheetToJson.transform(source, langCode);

    if (mergeLanguages || langCode) {
      return this.jsonToXml.transform(json);
    }

    return Object.keys(json).map(langName => {
      const xmlTranslations = this.jsonToXml.transform(json[langName]);
      return { lang: langName, content: xmlTranslations };
    });
  }
}
