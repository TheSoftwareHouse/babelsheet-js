import ITransformer from './transformer';

export default class SpreadsheetToJsonStringTransformer implements ITransformer {
  private readonly supportedType = 'json';

  constructor(private spreadsheetToJson: ITransformer) {}

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
      return JSON.stringify(json);
    }

    return Object.keys(json).map(langName => {
      const jsonString = JSON.stringify(json[langName]);
      return { lang: langName, content: jsonString };
    });
  }
}
