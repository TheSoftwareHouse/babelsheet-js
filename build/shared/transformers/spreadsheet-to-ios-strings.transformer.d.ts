import ITransformer from './transformer';
export default class SpreadsheetToIosStringsTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToFlatList;
    private flatListToIosStrings;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToFlatList: ITransformer, flatListToIosStrings: ITransformer);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }, langCode?: string): string;
}
