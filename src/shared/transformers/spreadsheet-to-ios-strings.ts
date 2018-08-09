import ITransformer from './transformer';

export default class SpreadsheetToIosStrings implements ITransformer {
  private readonly supportedType = 'strings';

  constructor(
    private spreadsheetToJson: ITransformer,
    private jsonToFlatList: ITransformer,
    private flatListToIosStrings: ITransformer
  ) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: { [key: string]: string[] }, langCode?: string): string {
    const json = this.spreadsheetToJson.transform(source, langCode);
    const flatList = this.jsonToFlatList.transform(json);
    return this.flatListToIosStrings.transform(flatList);
  }
}
