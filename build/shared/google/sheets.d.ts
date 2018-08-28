import GoogleAuth from './auth';
export default class GoogleSheets {
    private googleAuth;
    constructor(googleAuth: GoogleAuth);
    fetchSpreadsheet(credentials: {
        [key: string]: string;
    }): Promise<{
        [key: string]: string[];
    }>;
}
