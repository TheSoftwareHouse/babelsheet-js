import ITransformer from './transformer';

export default class SpreadsheetToXlfTransformer implements ITransformer {
  private readonly supportedType = 'xlf';

  constructor(private spreadsheetToJson: ITransformer, private jsonToXlf: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(
    source: { [key: string]: string[] },
    langCode?: string,
    mergeLanguages?: boolean
  ): string | object[] {
    const json = this.spreadsheetToJson.transform(source, langCode);

    return Object.keys(json).map(langName => {
      const xlfTranslations = this.jsonToXlf.transform(json[langName]);
      return { lang: langName, content: xlfTranslations };
    });
    //xlf.transform ({base: ..., translations: ...})
    //  if (mergeLanguages || langCode) {
    //    return this.jsonToXml.transform(json);
    //  }

    //  return Object.keys(json).map(langName => {
    //    const xmlTranslations = this.jsonToXml.transform(json[langName]);
    //    return { lang: langName, content: xmlTranslations };
    //  });
  }
}
