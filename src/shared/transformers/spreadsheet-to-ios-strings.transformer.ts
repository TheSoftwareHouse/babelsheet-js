import ITransformer, { ITranslationsData } from './transformer';

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

  public transform(source: ITranslationsData): ITranslationsData {
    const json = this.spreadsheetToJson.transform(source);
    const jsonMasked = this.jsonToJsonMasked.transform(json);

    if (source.meta.mergeLanguages) {
      return this.jsonToIosStrings.transform(jsonMasked);
    }
    return this.jsonToIosStrings.transform(jsonMasked);
  }
}
