import { ITokenProvider } from './token-provider.spec';
import IStorage from '../../infrastructure/storage/storage';

export default class TokenProvider implements ITokenProvider {
  currentReadProvider: any = null;

  constructor(private writeProvider: IStorage, private readProviders: IStorage[]) {}

  async setToken(value: string) {
    this.writeProvider.set('token', value);
  }

  async getToken(): Promise<any> {
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
