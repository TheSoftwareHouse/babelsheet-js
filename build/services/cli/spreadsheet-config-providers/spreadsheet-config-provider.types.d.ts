import { Arguments } from 'yargs';
export interface ISpreadsheetConfig {
    [key: string]: string;
}
export interface ISpreadsheetConfigService {
    getSpreadsheetConfig(args: Arguments | {
        [key: string]: string;
    }): ISpreadsheetConfig;
    validateConfig(config: ISpreadsheetConfig): void;
    supports(type: string): boolean;
}
