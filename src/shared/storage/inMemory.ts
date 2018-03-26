import { Credentials } from "google-auth-library/build/src/auth/credentials";
import Storage from "./index";

export default class InMemoryStorage implements Storage {
  private _data: any;

  constructor() {
    this._data = {};
  }

  set(key: string, value: any): void {
    this._data[key] = value;
  }

  get(key: string) {
    return this._data[key];
  }
}
