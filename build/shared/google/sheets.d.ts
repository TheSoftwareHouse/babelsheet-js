import GoogleAuth from './auth';
export default class GoogleSheets {
    private googleAuth;
    constructor(googleAuth: GoogleAuth);
    fetchSpreadsheet(credentials: {
        [key: string]: string | undefined;
    }): Promise<{
        [key: string]: string[];
    }>;
}
