import ITransformer from './transformer';
export default class SpreadsheetToYamlTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToYaml;
    private jsonToJsonMasked;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToYaml: ITransformer, jsonToJsonMasked: ITransformer);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }, { langCode, mergeLanguages, filters, }?: {
        langCode?: string;
        mergeLanguages?: boolean;
        filters?: string[];
    }): string | object[];
}
