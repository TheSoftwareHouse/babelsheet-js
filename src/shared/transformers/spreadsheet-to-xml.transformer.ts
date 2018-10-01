import ITransformer from './transformer';

export default class SpreadsheetToXmlTransformer implements ITransformer {
  private readonly supportedType = 'xml';

  constructor(
    private spreadsheetToJson: ITransformer,
    private jsonToXml: ITransformer,
    private jsonToJsonMasked: ITransformer
  ) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(
    source: { [key: string]: string[] },
    {
      langCode,
      mergeLanguages,
      filters,
    }: {
      langCode?: string;
      mergeLanguages?: boolean;
      filters?: string[];
    } = {}
  ): string | object[] {
    let json = this.spreadsheetToJson.transform(source, { langCode });
    json = this.jsonToJsonMasked.transform(json, { filters });

    if (mergeLanguages || langCode) {
      return this.jsonToXml.transform(json);
    }

    return Object.keys(json).map(langName => {
      const xmlTranslations = this.jsonToXml.transform(json[langName]);
      return { lang: langName, content: xmlTranslations };
    });
  }
}
