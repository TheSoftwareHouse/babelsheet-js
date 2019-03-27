import { ISpreadsheetConfigService } from './spreadsheet-config-provider.types';
export declare class ConfigProviderFactory {
    private providers;
    constructor(providers: ISpreadsheetConfigService[]);
    getProviderFor(type: string): ISpreadsheetConfigService;
}
