import { Credentials } from "google-auth-library/build/src/auth/credentials";
import Storage from "../../shared/storage/index";

export default class TokenStorage {
  private storage: Storage;

  constructor(opts: any) {
    this.storage = opts.storage;

    if (!this.token) {
      this.token = {};
    }
  }

  set token(token: Credentials) {
    this.storage.set("token", token);
  }

  get token(): Credentials {
    return this.storage.get("token");
  }
}
