import * as xlsx from 'js-xlsx';
import { trimEnd } from 'lodash';
import { ISheetsProvider, ISpreadsheetValues } from './sheets-provider.types';

const DELIMITER = ',';
const NEW_LINE = '\n';

export default class InFileSheetsProvider implements ISheetsProvider {
  public async getSpreadsheetValues(config: { [key: string]: string }): Promise<ISpreadsheetValues> {
    const { spreadsheetFilePath, spreadsheetName } = config;

    const fullSheet = xlsx.readFile(spreadsheetFilePath);

    const ranges: string[] = spreadsheetName ? [spreadsheetName] : fullSheet.SheetNames;

    return ranges.reduce((accumulator: any, sheetName) => {
      const sheetAsCsv = xlsx.utils.sheet_to_csv(fullSheet.Sheets[sheetName], { strip: true });

      if (!sheetAsCsv || sheetAsCsv.length === 0) {
        return accumulator;
      }

      accumulator[sheetName] = sheetAsCsv
        .split(NEW_LINE)
        .filter((row: string) => !this.isEmptyRow(row))
        .map((row: string) => trimEnd(row, DELIMITER))
        .map((row: string) => row.split(DELIMITER));

      return accumulator;
    }, {});
  }

  public supports(type: string) {
    return type === 'in-file';
  }

  private isEmptyRow(row: string): boolean {
    return row.split(DELIMITER).length === row.length + 1;
  }
}
