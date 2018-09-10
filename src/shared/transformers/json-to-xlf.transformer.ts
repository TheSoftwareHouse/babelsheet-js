import ITransformer from './transformer';

export default class JsonToXlfTransformer implements ITransformer {
  private readonly supportedType = 'json-xlf';

  constructor(private jsonToFlatList: ITransformer, private flatListToXlf: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: { [key: string]: string[] }): string {
    const flatList = this.jsonToFlatList.transform(source);
    //baseFlatList = ...
    //translationsFlatList = ...
    // { base: baseFlatList, translations: translationsFlatList }
    return this.flatListToXlf.transform(flatList);
  }
}
