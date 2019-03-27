import { ISheetsProvider } from './sheets-provider.types';

export class SheetsProviderFactory {
  constructor(private providers: ISheetsProvider[]) {}

  public getProviderFor(type: string) {
    const providerForType = this.providers.filter(provider => provider.supports(type));

    if (providerForType.length === 0) {
      throw new Error(`No sheets provider for type ${type}.`);
    }

    return providerForType[0];
  }
}
