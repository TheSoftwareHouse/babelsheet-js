import ITransformer from './transformer';
export default class JsonToIosStringsTransformer implements ITransformer {
    private jsonToFlatList;
    private flatListToIosStrings;
    private readonly supportedType;
    constructor(jsonToFlatList: ITransformer, flatListToIosStrings: ITransformer);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }): string;
}
