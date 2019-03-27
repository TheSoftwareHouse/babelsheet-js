import { Arguments } from 'yargs';
import { ISpreadsheetConfig, ISpreadsheetConfigService } from './spreadsheet-config-provider.types';
export declare class InFileSpreadsheetConfigService implements ISpreadsheetConfigService {
    getSpreadsheetConfig(args: Arguments): {
        [key: string]: string;
    };
    supports(type: string): boolean;
    validateConfig(config: ISpreadsheetConfig): void;
}
