import GoogleAuth from './auth';
export default class GoogleSheets {
    private googleAuth;
    constructor(googleAuth: GoogleAuth);
    fetchSpreadsheet(): Promise<{
        [key: string]: string[];
    }>;
}
