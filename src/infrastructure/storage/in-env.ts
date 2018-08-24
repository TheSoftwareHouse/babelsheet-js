import Storage from './storage';

export default class InEnvStorage implements Storage {
  constructor() {}

  public async set(key: string, value: any) {
    process.env[key.toUpperCase()] = JSON.stringify(value);
  }

  public async get(key: string) {
    return Promise.resolve(this.tryParse(process.env[key.toUpperCase()]));
  }

  public async has(key: string) {
    return Promise.resolve(Boolean(await this.get(key.toUpperCase())));
  }

  public async clear() {
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
