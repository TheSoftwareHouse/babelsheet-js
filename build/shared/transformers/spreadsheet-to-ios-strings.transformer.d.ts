import ITransformer from './transformer';
export default class SpreadsheetToIosStringsTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToIosStrings;
    private jsonToJsonMasked;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToIosStrings: ITransformer, jsonToJsonMasked: ITransformer);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }, { langCode, mergeLanguages, filters, }?: {
        langCode?: string;
        mergeLanguages?: boolean;
        filters?: string[];
    }): string | object[];
}
