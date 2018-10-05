export default class FakeGoogleSheets {
    private returnData;
    constructor(returnData: {
        [key: string]: string[];
    });
    fetchSpreadsheet(credentials: {
        [key: string]: string;
    }): Promise<{
        [key: string]: string[];
    }>;
}
