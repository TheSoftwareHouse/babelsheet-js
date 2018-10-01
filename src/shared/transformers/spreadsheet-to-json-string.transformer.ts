import ITransformer from './transformer';

export default class SpreadsheetToJsonStringTransformer implements ITransformer {
  private readonly supportedType = 'json';

  constructor(private spreadsheetToJson: ITransformer, private jsonToJsonMasked: ITransformer) {}

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
      return JSON.stringify(json);
    }

    return Object.keys(json).map(langName => {
      const jsonString = JSON.stringify(json[langName]);
      return { lang: langName, content: jsonString };
    });
  }
}
