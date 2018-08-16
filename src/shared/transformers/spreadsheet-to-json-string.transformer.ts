import ITransformer from './transformer';

export default class SpreadsheetToJsonStringTransformer implements ITransformer {
  private readonly supportedType = 'json';

  constructor(private spreadsheetToJson: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: { [key: string]: string[] }, langCode?: string, separate?: boolean): Array<any> | string {
    const json = this.spreadsheetToJson.transform(source, langCode);
    if (!separate) {
      return JSON.stringify(json);
    }

    return Object.keys(json).map(langName => {
      const jsonString = JSON.stringify(json[langName]);
      return { lang: langName, content: jsonString };
    });
  }
}
