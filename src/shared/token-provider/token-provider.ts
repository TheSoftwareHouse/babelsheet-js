import IStorage from '../../infrastructure/storage/storage';
import { ITokenProvider } from './token-provider.types';

export default class TokenProvider implements ITokenProvider {
  private currentReadProvider: any = null;

  constructor(private writeProvider: IStorage, private readProviders: IStorage[]) {}

  public async setToken(value: string): Promise<void> {
    this.writeProvider.set('token', value);
  }

  public async getToken(): Promise<any> {
    if (this.currentReadProvider) {
      return this.currentReadProvider.get('token');
    }

    for (const readProvider of this.readProviders) {
      const value = await readProvider.get('token');
      if (value) {
        this.currentReadProvider = readProvider;
        return value;
      }
    }

    return null;
  }
}
