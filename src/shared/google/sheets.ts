import { google } from 'googleapis';
import * as util from 'util';
import GoogleAuth from './auth';

export default class GoogleSheets {
  constructor(private googleAuth: GoogleAuth) {}

  public async fetchSpreadsheet(credentials: { [key: string]: string }): Promise<{ [key: string]: string[] }> {
    const oAuth2Client = await this.googleAuth.getAuthenticatedClient(credentials);
    const sheets = google.sheets('v4');

    return util
      .promisify(sheets.spreadsheets.values.get)({
        auth: oAuth2Client,
        range: credentials.spreadsheetName || process.env.SPREADSHEET_NAME,
        spreadsheetId: credentials.spreadsheetId || process.env.SPREADSHEET_ID,
      })
      .then((res: any) => res.data.values);
  }
}
