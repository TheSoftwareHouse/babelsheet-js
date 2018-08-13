import ITransformer from './transformer';

export default class JsonToIosStringsTransformer implements ITransformer {
  private readonly supportedType = 'json-ios-strings';

  constructor(private jsonToFlatList: ITransformer, private flatListToIosStrings: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: { [key: string]: string[] }): string {
    const flatList = this.jsonToFlatList.transform(source);
    return this.flatListToIosStrings.transform(flatList);
  }
}
