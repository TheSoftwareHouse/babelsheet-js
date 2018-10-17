import ITransformer, { ITranslationsData } from './transformer';

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

  public transform(source: ITranslationsData): ITranslationsData {
    const json = this.spreadsheetToJson.transform(source);
    const jsonMasked = this.jsonToJsonMasked.transform(json);
    return this.jsonToXlf.transform(jsonMasked);
  }
}
