import ITransformer from './transformer';

export default class SpreadsheetToXlfTransformer implements ITransformer {
  private readonly supportedType = 'xlf';

  constructor(
    private spreadsheetToJson: ITransformer,
    private jsonToXlf: ITransformer,
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
      return this.jsonToXlf.transform(jsonMasked);
    }

    return Object.keys(jsonMasked).map(langName => {
      const xlfTranslations = this.jsonToXlf.transform(jsonMasked[langName]);
      return { lang: langName, content: xlfTranslations };
    });
  }
}
