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
    const json = this.spreadsheetToJson.transform(source, { langCode });
    const jsonMasked = this.jsonToJsonMasked.transform(json, { filters });

    if (mergeLanguages || langCode) {
      return this.jsonToXml.transform(jsonMasked);
    }

    return Object.keys(jsonMasked).map(langName => {
      const xmlTranslations = this.jsonToXml.transform(jsonMasked[langName]);
      return { lang: langName, content: xmlTranslations };
    });
  }
}
