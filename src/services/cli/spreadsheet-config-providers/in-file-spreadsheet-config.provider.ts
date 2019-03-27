import { Arguments } from 'yargs';
import { ISpreadsheetConfig, ISpreadsheetConfigService } from './spreadsheet-config-provider.types';

export class InFileSpreadsheetConfigService implements ISpreadsheetConfigService {
  public getSpreadsheetConfig(args: Arguments): { [key: string]: string } {
    const {
      BABELSHEET_SPREADSHEET_SOURCE,
      BABELSHEET_SPREADSHEET_NAME,
      BABELSHEET_SPREADSHEET_FILE_PATH,
    } = process.env;

    const config = {
      spreadsheetName: args['spreadsheet-name'] || BABELSHEET_SPREADSHEET_NAME,
      spreadsheetSource: args['spreadsheet-source'] || BABELSHEET_SPREADSHEET_SOURCE,
      spreadsheetFilePath: args['file-path'] || BABELSHEET_SPREADSHEET_FILE_PATH,
    };

    return config;
  }

  public supports(type: string): boolean {
    return type === 'in-file';
  }

  public validateConfig(config: ISpreadsheetConfig): void {
    if (!config.spreadsheetFilePath) {
      throw new Error('Please provide file path with spreadsheet.');
    }
  }
}
