import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import * as util from 'util';
import GoogleAuth from './auth';

interface ISheetValues {
  [key: string]: string[];
}

export default class GoogleSheets {
  constructor(private googleAuth: GoogleAuth) {}

  public async fetchSpreadsheet(credentials: { [key: string]: string }): Promise<{ [key: string]: ISheetValues }> {
    const oAuth2Client = await this.googleAuth.getAuthenticatedClient(credentials);
    const sheets = google.sheets('v4');

    const { spreadsheetId, spreadsheetName } = credentials;

    const ranges = spreadsheetName
      ? [spreadsheetName]
      : await this.getAllSpreadsheetsNames(oAuth2Client, spreadsheetId);

    return util
      .promisify(sheets.spreadsheets.values.batchGet)({
        auth: oAuth2Client,
        ranges,
        spreadsheetId,
      })
      .then((res: any) => {
        const valuesBySpreadsheet: { [key: string]: any } = {};

        for (let i = 0; i < res.data.valueRanges.length; ++i) {
          valuesBySpreadsheet[ranges[i]] = res.data.valueRanges[i].values;
        }

        return valuesBySpreadsheet;
      });
  }

  private getAllSpreadsheetsNames(auth: OAuth2Client, spreadsheetId: string): Promise<string[]> {
    const sheets = google.sheets('v4');

    return util
      .promisify(sheets.spreadsheets.get)({
        auth,
        ranges: [],
        spreadsheetId,
      })
      .then((res: any) => res.data.sheets.map((sheet: any) => sheet.properties.title));
  }
}
