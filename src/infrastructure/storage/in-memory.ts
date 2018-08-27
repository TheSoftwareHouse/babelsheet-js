import IStorage from './storage';

export default class InMemoryStorage implements IStorage {
  private data: any;

  constructor() {
    this.data = {};
  }

  public async set(key: string, value: any) {
    this.data[key] = value;
    return Promise.resolve();
  }

  public async get(key: string): Promise<any> {
    return this.data[key];
  }

  public async has(key: string) {
    return Boolean(this.data[key]);
  }

  public async getData() {
    return this.data;
  }

  public async clear() {
    this.data = {};
  }
}
