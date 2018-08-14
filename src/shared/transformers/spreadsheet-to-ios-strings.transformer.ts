import ITransformer from './transformer';

export default class SpreadsheetToIosStringsTransformer implements ITransformer {
  private readonly supportedType = 'strings';

  constructor(private spreadsheetToJson: ITransformer, private jsonToIosStrings: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: { [key: string]: string[] }, langCode?: string): string {
    const json = this.spreadsheetToJson.transform(source, langCode);
    return this.jsonToIosStrings.transform(json);
  }
}
