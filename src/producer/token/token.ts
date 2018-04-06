import { Credentials } from "google-auth-library/build/src/auth/credentials";
import IStorage from "../../shared/storage/storage";

export default class TokenStorage {
  private storage: IStorage;

  constructor(opts: any) {
    this.storage = opts.storage;
  }

  public async setToken(token: Credentials) {
    this.storage.set("token", token);
  }

  public async getToken(): Promise<Credentials> {
    return this.storage.get("token");
  }
}
