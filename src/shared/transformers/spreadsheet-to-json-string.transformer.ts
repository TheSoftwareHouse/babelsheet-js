import ITransformer from './transformer';

export default class SpreadsheetToJsonStringTransformer implements ITransformer {
  private readonly supportedType = 'json';

  constructor(private spreadsheetToJson: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: { [key: string]: string[] }, langCode?: string): string {
    return JSON.stringify(this.spreadsheetToJson.transform(source, langCode));
  }
}
