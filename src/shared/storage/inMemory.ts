import IStorage from "./storage";

export default class InMemoryStorage implements IStorage {
  private data: any;

  constructor() {
    this.data = {};
  }

  public async set(key: string, value: any) {
    this.data[key] = value;
  }

  public async get(key: string): Promise<any> {
    return Promise.resolve(this.data[key]);
  }
}
