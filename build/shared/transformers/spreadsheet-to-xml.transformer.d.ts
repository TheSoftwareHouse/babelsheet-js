import ITransformer from './transformer';
export default class SpreadsheetToXmlTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToFlatList;
    private flatListToXml;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToFlatList: ITransformer, flatListToXml: ITransformer);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }, langCode?: string): string;
}
