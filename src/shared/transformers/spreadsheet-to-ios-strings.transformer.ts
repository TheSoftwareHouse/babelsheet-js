import ITransformer from './transformer';

export default class SpreadsheetToIosStringsTransformer implements ITransformer {
  private readonly supportedType = 'strings';

  constructor(private spreadsheetToJson: ITransformer, private jsonToIosStrings: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: { [key: string]: string[] }, langCode?: string, separate?: boolean): string | Array<any> {
    const json = this.spreadsheetToJson.transform(source, langCode);

    if (!separate) {
      return this.jsonToIosStrings.transform(json);
    }

    return Object.keys(json).map(langName => {
      const iosStrings = this.jsonToIosStrings.transform(json[langName]);
      return { lang: langName, content: iosStrings };
    });
  }
}
