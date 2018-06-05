import { google } from 'googleapis';
import * as util from 'util';
import GoogleAuth from './auth';

export default class GoogleSheets {
  constructor(private googleAuth: GoogleAuth) {}

  public async fetchSpreadsheet(): Promise<{ [key: string]: string[] }> {
    const oAuth2Client = await this.googleAuth.getAuthenticatedClient();
    const sheets = google.sheets('v4');

    return util
      .promisify(sheets.spreadsheets.values.get)({
        auth: oAuth2Client,
        range: process.env.SPREADSHEET_NAME,
        spreadsheetId: process.env.SPREADSHEET_ID,
      })
      .then((res: any) => res.data.values);
  }
}
