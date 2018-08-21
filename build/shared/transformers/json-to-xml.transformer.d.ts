import ITransformer from './transformer';
export default class JsonToXmlTransformer implements ITransformer {
    private jsonToFlatList;
    private flatListToXml;
    private readonly supportedType;
    constructor(jsonToFlatList: ITransformer, flatListToXml: ITransformer);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }): string;
}
