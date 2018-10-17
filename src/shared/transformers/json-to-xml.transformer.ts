import ITransformer, { ITranslationsData } from './transformer';

export default class JsonToXmlTransformer implements ITransformer {
  private readonly supportedType = 'json-xml';

  constructor(private jsonToFlatList: ITransformer, private flatListToXml: ITransformer) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    const flatList = this.jsonToFlatList.transform(source);
    return this.flatListToXml.transform(flatList);
  }
}
