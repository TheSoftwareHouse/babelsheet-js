export default class FakeGoogleSheets {
    private returnData;
    constructor(returnData?: {
        [key: string]: string[];
    } | string[][]);
    fetchSpreadsheet(credentials: {
        [key: string]: string;
    }): Promise<string[][] | {
        [key: string]: string[];
    }>;
}
