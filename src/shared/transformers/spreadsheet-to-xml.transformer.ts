import ITransformer from './transformer';

export default class SpreadsheetToXmlTransformer implements ITransformer {
  private readonly supportedType = 'xml';

  constructor(
    private spreadsheetToJson: ITransformer,
    private jsonToFlatList: ITransformer,
    private flatListToXml: ITransformer
  ) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: { [key: string]: string[] }, langCode?: string): string {
    const json = this.spreadsheetToJson.transform(source, langCode);
    const flatList = this.jsonToFlatList.transform(json);
    return this.flatListToXml.transform(flatList);
  }
}
