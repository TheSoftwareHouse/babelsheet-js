import { spreadsheetData } from './testData';

export default class FakeGoogleSheets {
  constructor(private returnData: { [key: string]: string[][] } = spreadsheetData.multiRawSpreadsheetData) {}

  public async fetchSpreadsheet(credentials: { [key: string]: string }): Promise<{ [key: string]: string[][] }> {
    return this.returnData;
  }
}
