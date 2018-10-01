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
    const json = this.spreadsheetToJson.transform(source, { langCode });
    const jsonMasked = this.jsonToJsonMasked.transform(json, { filters });

    if (mergeLanguages || langCode) {
      return this.jsonToIosStrings.transform(jsonMasked);
    }

    return Object.keys(jsonMasked).map(langName => {
      const iosStrings = this.jsonToIosStrings.transform(jsonMasked[langName]);
      return { lang: langName, content: iosStrings };
    });
  }
}
