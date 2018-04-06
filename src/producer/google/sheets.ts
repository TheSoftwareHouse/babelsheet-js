import { google } from "googleapis";
import * as util from "util";
import GoogleAuth from "./auth";

export default class GoogleSheets {
  private googleAuth: GoogleAuth;

  constructor(opts: any) {
    this.googleAuth = opts.googleAuth;
  }

  public async fetchSpreadsheet(): Promise<{ [key: string]: string[] }> {
    const oAuth2Client = await this.googleAuth.getAuthenticatedClient();
    const sheets = google.sheets("v4");

    return util
      .promisify(sheets.spreadsheets.values.get)({
        auth: oAuth2Client,
        range: "Sheet1",
        spreadsheetId: "1XWxmZ-NN-1rkAN5Rp_FtBJKVM196XALKO8BJDk_jDH8"
      })
      .then((res: any) => res.data.values);
  }
}
