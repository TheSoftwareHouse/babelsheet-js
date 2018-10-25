import ITransformer, { ITranslationsData } from './transformer';
export default class SpreadsheetToIosStringsTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToIosStrings;
    private jsonToJsonMasked;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToIosStrings: ITransformer, jsonToJsonMasked: ITransformer);
    supports(type: string): boolean;
    transform(source: ITranslationsData): ITranslationsData;
}
