import { spreadsheetData } from './testData';

export default class FakeGoogleSheets {
  constructor(private returnData: { [key: string]: string[][] } = spreadsheetData.multiRawSpreadsheetData) {}

  public async getSpreadsheetValues(credentials: { [key: string]: string }): Promise<{ [key: string]: string[][] }> {
    return this.returnData;
  }

  public supports(type: string): boolean {
    return type === 'google';
  }
}
