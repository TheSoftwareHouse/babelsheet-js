import { google } from "googleapis";
import * as util from "util";
import GoogleAuth from "./auth";

export default class GoogleSheets {
  private logger: any;
  private googleAuth: GoogleAuth;

  constructor(opts: any) {
    this.logger = opts.logger;
    this.googleAuth = opts.googleAuth;
  }

  async fetchSpreadsheet(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const oAuth2Client = await this.googleAuth.getAuthenticatedClient();

      const sheets = google.sheets("v4");

      util
        .promisify(sheets.spreadsheets.values.get)({
          auth: oAuth2Client,
          spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
          range: "Class Data"
        })
        .then((res: any) => {
          resolve(res.data.values);
        });
    });
  }
}
