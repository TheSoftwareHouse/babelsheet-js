import ITransformer from './transformer';
export default class SpreadsheetToYamlTransformer implements ITransformer {
    private spreadsheetToJson;
    private jsonToYaml;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer, jsonToYaml: ITransformer);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }, langCode?: string, mergeLanguages?: boolean): string | object[];
}
