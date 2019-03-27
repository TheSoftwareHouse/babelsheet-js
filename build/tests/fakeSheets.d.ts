export default class FakeGoogleSheets {
    private returnData;
    constructor(returnData?: {
        [key: string]: string[][];
    });
    getSpreadsheetValues(credentials: {
        [key: string]: string;
    }): Promise<{
        [key: string]: string[][];
    }>;
    supports(type: string): boolean;
}
