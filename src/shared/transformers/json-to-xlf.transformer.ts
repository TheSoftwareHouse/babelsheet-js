import ITransformer, { ITranslationsData } from './transformer';

export default class JsonToXlfTransformer implements ITransformer {
  private readonly supportedType = 'json-xlf';

  constructor(private jsonToFlatList: ITransformer, private flatListToXlf: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    const flatList = this.jsonToFlatList.transform(source);
    return this.flatListToXlf.transform(flatList);
  }
}
