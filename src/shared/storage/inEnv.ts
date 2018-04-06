import Storage from "./storage";

export default class InEnvStorage implements Storage {
  private data: any;

  constructor() {
    this.data = {};
  }

  public async set(key: string, value: any) {
    this.data[key] = value;
  }

  public async get(key: string) {
    if (this.data[key]) {
      return Promise.resolve(this.tryParse(this.data[key]));
    }

    return Promise.resolve(this.tryParse(process.env[key]));
  }

  private tryParse(value: any) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
}
