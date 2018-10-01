import ITransformer from './transformer';

export default class SpreadsheetToIosStringsTransformer implements ITransformer {
  private readonly supportedType = 'strings';

  constructor(
    private spreadsheetToJson: ITransformer,
    private jsonToIosStrings: ITransformer,
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
      return this.jsonToIosStrings.transform(json);
    }

    return Object.keys(json).map(langName => {
      const iosStrings = this.jsonToIosStrings.transform(json[langName]);
      return { lang: langName, content: iosStrings };
    });
  }
}
