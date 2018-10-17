import ITransformer, { ITranslationsData } from './transformer';
export default class SpreadsheetToXlfTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToXlf;
    private jsonToJsonMasked;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToXlf: ITransformer, jsonToJsonMasked: ITransformer);
    supports(type: string): boolean;
    transform(source: ITranslationsData): ITranslationsData;
}
