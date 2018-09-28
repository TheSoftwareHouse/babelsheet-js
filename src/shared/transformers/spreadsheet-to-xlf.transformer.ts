import ITransformer from './transformer';

export default class SpreadsheetToXlfTransformer implements ITransformer {
  private readonly supportedType = 'xlf';

  constructor(private spreadsheetToJson: ITransformer, 
    private jsonToXlf: ITransformer,
  private jsonToJsonMasked: ITransformer,) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(
    source: { [key: string]: string[] },
    langCode?: string,
    mergeLanguages?: boolean,
    filters?: string[],
  ): string | object[] {
    let json = this.spreadsheetToJson.transform(source, langCode);
    json = this.jsonToJsonMasked.transform(json, undefined, undefined, filters);

    if (mergeLanguages || langCode) {
      return this.jsonToXlf.transform(json);
    }

    return Object.keys(json).map(langName => {
      const xlfTranslations = this.jsonToXlf.transform(json[langName]);
      return { lang: langName, content: xlfTranslations };
    });
  }
}
