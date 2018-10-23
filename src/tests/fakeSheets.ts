import { spreadsheetData } from "./testData";

export default class FakeGoogleSheets {
  constructor(private returnData: { [key: string]: string[]} | string[][] = spreadsheetData.multiRawSpreadsheetData) {}

  public async fetchSpreadsheet(credentials: { [key: string]: string }): Promise<string[][] | { [key: string]: string[] }> {
    return this.returnData;
  }
}
