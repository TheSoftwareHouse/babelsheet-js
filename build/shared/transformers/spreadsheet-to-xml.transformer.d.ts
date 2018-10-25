import ITransformer, { ITranslationsData } from './transformer';
export default class SpreadsheetToXmlTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToXml;
    private jsonToJsonMasked;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToXml: ITransformer, jsonToJsonMasked: ITransformer);
    supports(type: string): boolean;
    transform(source: ITranslationsData): ITranslationsData;
}
