import ITransformer from './transformer';
export default class SpreadsheetToIosStringsTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToIosStrings;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToIosStrings: ITransformer);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }, langCode?: string, mergeLanguages?: boolean): string | object[];
}
