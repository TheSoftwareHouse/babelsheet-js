import ITransformer from './transformer';
export default class JsonToXlfTransformer implements ITransformer {
    private jsonToFlatList;
    private flatListToXlf;
    private readonly supportedType;
    constructor(jsonToFlatList: ITransformer, flatListToXlf: ITransformer);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }): string;
}
