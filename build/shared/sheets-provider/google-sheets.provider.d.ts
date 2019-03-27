import GoogleAuth from '../google/auth';
import { ISheetsProvider, ISpreadsheetValues } from './sheets-provider.types';
export default class GoogleSheetsProvider implements ISheetsProvider {
    private googleAuth;
    constructor(googleAuth: GoogleAuth);
    getSpreadsheetValues(credentials: {
        [key: string]: string;
    }): Promise<ISpreadsheetValues>;
    supports(type: string): boolean;
    private getAllSpreadsheetsNames;
}
