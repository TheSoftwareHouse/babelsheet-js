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
    const json = this.spreadsheetToJson.transform(source, { langCode });
    const jsonMasked = this.jsonToJsonMasked.transform(json, { filters });

    if (mergeLanguages || langCode) {
      return JSON.stringify(jsonMasked);
    }

    return Object.keys(jsonMasked).map(langName => {
      const jsonString = JSON.stringify(jsonMasked[langName]);
      return { lang: langName, content: jsonString };
    });
  }
}
