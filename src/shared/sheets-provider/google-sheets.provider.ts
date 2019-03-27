import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import * as util from 'util';
import GoogleAuth from '../google/auth';
import { ISheetsProvider, ISpreadsheetValues } from './sheets-provider.types';

export default class GoogleSheetsProvider implements ISheetsProvider {
  constructor(private googleAuth: GoogleAuth) {}

  public async getSpreadsheetValues(credentials: { [key: string]: string }): Promise<ISpreadsheetValues> {
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

  public supports(type: string) {
    return type === 'google';
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
