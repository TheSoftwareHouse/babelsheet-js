import { ISheetsProvider, ISpreadsheetValues } from './sheets-provider.types';
export default class InFileSheetsProvider implements ISheetsProvider {
    getSpreadsheetValues(config: {
        [key: string]: string;
    }): Promise<ISpreadsheetValues>;
    supports(type: string): boolean;
    private isEmptyRow;
}
