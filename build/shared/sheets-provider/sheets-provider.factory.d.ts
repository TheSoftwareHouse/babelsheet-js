import { ISheetsProvider } from './sheets-provider.types';
export declare class SheetsProviderFactory {
    private providers;
    constructor(providers: ISheetsProvider[]);
    getProviderFor(type: string): ISheetsProvider;
}
