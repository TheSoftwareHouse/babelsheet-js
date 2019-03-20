import GoogleAuth from './auth';
interface ISheetValues {
    [key: string]: string[];
}
export default class GoogleSheets {
    private googleAuth;
    constructor(googleAuth: GoogleAuth);
    fetchSpreadsheet(credentials: {
        [key: string]: string;
    }): Promise<{
        [key: string]: ISheetValues;
    }>;
    private getAllSpreadsheetsNames;
}
export {};
