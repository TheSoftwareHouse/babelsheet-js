import ITransformer from './transformer';
export default class SpreadsheetToXlfTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToXlf;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToXlf: ITransformer);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }, langCode?: string, mergeLanguages?: boolean): string | object[];
}
