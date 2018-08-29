import IStorage from '../../infrastructure/storage/storage';
import { ITokenProvider } from './token-provider.types';

export default class TokenProvider implements ITokenProvider {
  private currentReadProvider: any = null;

  constructor(private writeProvider: IStorage, private readProviders: IStorage[]) {}

  public async setRefreshToken(value: string): Promise<void> {
    this.writeProvider.set('refresh_token', value);
  }

  public async getRefreshToken(): Promise<any> {
    if (this.currentReadProvider) {
      return this.currentReadProvider.get('refresh_token');
    }

    for (const readProvider of this.readProviders) {
      const value = await readProvider.get('refresh_token');
      if (value) {
        this.currentReadProvider = readProvider;
        return value;
      }
    }

    return null;
  }
}
