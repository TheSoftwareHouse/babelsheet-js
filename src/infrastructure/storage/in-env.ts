import Storage from './storage';

export default class InEnvStorage implements Storage {
  private data: any;

  constructor() {
    this.data = {};
  }

  public async set(key: string, value: any) {
    this.data[key] = value;
    return Promise.resolve();
  }

  public async get(key: string) {
    if (this.data[key]) {
      return Promise.resolve(this.tryParse(this.data[key]));
    }

    return Promise.resolve(this.tryParse(process.env[key]));
  }

  public async has(key: string) {
    return Promise.resolve(Boolean(await this.get(key)));
  }

  public async clear() {
    this.data = {};
    return Promise.resolve();
  }

  private tryParse(value: any) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
}
