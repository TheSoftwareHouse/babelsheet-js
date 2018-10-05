export default class FakeGoogleSheets {
  constructor(private returnData: { [key: string]: string[] }) {}

  public async fetchSpreadsheet(credentials: { [key: string]: string }): Promise<{ [key: string]: string[] }> {
    return this.returnData;
  }
}
