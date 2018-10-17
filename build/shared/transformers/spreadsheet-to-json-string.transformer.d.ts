import ITransformer, { ITranslationsData } from './transformer';
export default class SpreadsheetToJsonStringTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToJsonMasked;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToJsonMasked: ITransformer);
    supports(type: string): boolean;
    transform(source: ITranslationsData): ITranslationsData;
}
