import ITransformer from './transformer';
export default class SpreadsheetToXmlTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToXml;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToXml: ITransformer);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }, langCode?: string, mergeLanguages?: boolean): string | object[];
}
