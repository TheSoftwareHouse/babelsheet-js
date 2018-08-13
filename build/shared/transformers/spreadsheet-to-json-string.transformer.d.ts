import ITransformer from './transformer';
export default class SpreadsheetToJsonStringTransformer implements ITransformer {
    private spreadsheetToJson;
    private readonly supportedType;
    constructor(spreadsheetToJson: ITransformer);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }, langCode?: string): string;
}
