import ITransformer, { ITranslationsData } from './transformer';

export default class SpreadsheetToXmlTransformer implements ITransformer {
  private readonly supportedType = 'xml';

  constructor(
    private spreadsheetToJson: ITransformer,
    private jsonToXml: ITransformer,
    private jsonToJsonMasked: ITransformer
  ) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    const json = this.spreadsheetToJson.transform(source);
    const jsonMasked = this.jsonToJsonMasked.transform(json);
    return this.jsonToXml.transform(jsonMasked);
  }
}
