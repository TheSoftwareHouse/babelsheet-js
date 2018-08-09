import ITransformer from '../../shared/transformers/transformer';

export default class SpreadsheetToXmlTransformer implements ITransformer {
  private readonly supportedType = 'xml';

  constructor(private spreadsheetToJson: ITransformer, private jsonToXml: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: { [key: string]: string[] }): string {
    const json = this.spreadsheetToJson.transform(source);
    return this.jsonToXml.transform(json);
  }
}
