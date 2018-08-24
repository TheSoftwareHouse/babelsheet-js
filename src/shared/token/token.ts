import IStorage from '../../infrastructure/storage/storage';

export default class TokenStorage {
  constructor(private storage: IStorage) {}

  public async setToken(token: string | null | undefined) {
    this.storage.set('token', token);
  }

  public async getToken(): Promise<string | null | undefined> {
    return this.storage.get('token');
  }
}
