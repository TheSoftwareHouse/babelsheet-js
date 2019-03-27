import { ISpreadsheetConfigService } from './spreadsheet-config-provider.types';

export class ConfigProviderFactory {
  constructor(private providers: ISpreadsheetConfigService[]) {}

  public getProviderFor(type: string) {
    const providerForType = this.providers.filter(provider => provider.supports(type));

    if (providerForType.length === 0) {
      throw new Error(`No config provider for type ${type}`);
    }

    return providerForType[0];
  }
}
