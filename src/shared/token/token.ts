import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import IStorage from '../../infrastructure/storage/storage';

export default class TokenStorage {
  constructor(private storage: IStorage) {}

  public async setToken(token: Credentials) {
    this.storage.set('token', token);
  }

  public async getToken(): Promise<Credentials> {
    return this.storage.get('token');
  }
}
