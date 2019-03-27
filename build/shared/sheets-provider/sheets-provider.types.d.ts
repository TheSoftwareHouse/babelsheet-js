export interface ISheetValues {
    [key: string]: string[];
}
export interface IGetSpreadsheetArgs {
    [key: string]: string;
}
export interface ISpreadsheetValues {
    [key: string]: ISheetValues;
}
export interface ISheetsProvider {
    getSpreadsheetValues(args: IGetSpreadsheetArgs): Promise<ISpreadsheetValues>;
    supports(type: string): boolean;
}
