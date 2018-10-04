import ITransformer from './transformer';
export default class SpreadsheetToJsonStringTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToJsonMasked;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToJsonMasked: ITransformer);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }, { langCode, mergeLanguages, filters, }?: {
        langCode?: string;
        mergeLanguages?: boolean;
        filters?: string[];
    }): string | object[];
}
