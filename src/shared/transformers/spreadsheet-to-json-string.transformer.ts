import ITransformer, { ITranslationsData } from './transformer';

export default class SpreadsheetToJsonStringTransformer implements ITransformer {
  private readonly supportedType = 'json';

  constructor(private spreadsheetToJson: ITransformer, private jsonToJsonMasked: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    const json = this.spreadsheetToJson.transform(source);
    const jsonMasked = this.jsonToJsonMasked.transform(json);

    if (source.meta.mergeLanguages) {
      return { ...jsonMasked, result: JSON.stringify(jsonMasked.result) };
    }

    if (source.meta.langCode) {
      return { ...jsonMasked, result: { [source.meta.langCode]: JSON.stringify(jsonMasked.result) } };
    }

    return {
      ...jsonMasked,
      result: Object.keys(jsonMasked.result).map(langName => ({
        lang: langName,
        content: JSON.stringify(jsonMasked.result[langName]),
      })),
    };
  }
}
