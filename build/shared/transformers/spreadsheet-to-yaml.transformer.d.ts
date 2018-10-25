import ITransformer, { ITranslationsData } from './transformer';
export default class SpreadsheetToYamlTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToYaml;
    private jsonToJsonMasked;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToYaml: ITransformer, jsonToJsonMasked: ITransformer);
    supports(type: string): boolean;
    transform(source: ITranslationsData): ITranslationsData;
}
