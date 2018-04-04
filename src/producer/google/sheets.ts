import { google } from "googleapis";
import * as util from "util";
import GoogleAuth from "./auth";
import Transformer from "../transformer/transformer";

export default class GoogleSheets {
  private logger: any;
  private googleAuth: GoogleAuth;
  private transformer: Transformer;

  constructor(opts: any) {
    this.logger = opts.logger;
    this.googleAuth = opts.googleAuth;
    this.transformer = opts.transformer;
  }

  async fetchSpreadsheet(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const oAuth2Client = await this.googleAuth.getAuthenticatedClient();

      const sheets = google.sheets("v4");

      util
        .promisify(sheets.spreadsheets.values.get)({
          auth: oAuth2Client,
          spreadsheetId: "1XWxmZ-NN-1rkAN5Rp_FtBJKVM196XALKO8BJDk_jDH8",
          range: "Sheet1"
        })
        .then((res: any) => {
          resolve(JSON.stringify(this.transformer.transform(res.data.values)));
        });
    });
  }
}
