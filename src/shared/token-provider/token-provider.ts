import { ITokenProvider } from './token-provider.spec';
import IStorage from '../../infrastructure/storage/storage';

export default class TokenProvider implements ITokenProvider {
  currentProvider: any = null;
  constructor(private providers: IStorage[]) {}

  async set(key: string, value: string) {
    this.providers[0].set(key, value);
  }

  async get(key: string): Promise<any> {
    for (let i = 0; i < this.providers.length; ++i) {
      const value = await this.providers[i].get(key);
      if (value) {
        this.currentProvider = this.providers[i];
        return value;
      }
    }
    return null;
  }
}
