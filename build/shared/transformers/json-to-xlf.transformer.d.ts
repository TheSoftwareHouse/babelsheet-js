import ITransformer, { ITranslationsData } from './transformer';
export default class JsonToXlfTransformer implements ITransformer {
    private jsonToFlatList;
    private flatListToXlf;
    private readonly supportedType;
    constructor(jsonToFlatList: ITransformer, flatListToXlf: ITransformer);
    supports(type: string): boolean;
    transform(source: ITranslationsData): ITranslationsData;
}
