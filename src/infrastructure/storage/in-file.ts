import * as fs from 'fs';
import IStorage from './storage';

export default class InFileStorage implements IStorage {
  public async set(key: string, value: any) {
    this.saveData({ ...this.loadData(), [key]: value });
    return Promise.resolve();
  }

  public async get(key: string): Promise<any> {
    return Promise.resolve(this.loadData()[key]);
  }

  public async has(key: string) {
    return Promise.resolve(Boolean(await this.get(key)));
  }

  public async clear() {
    this.saveData({});
    return Promise.resolve();
  }

  private loadData() {
    if (fs.existsSync('data.json')) {
      return JSON.parse(fs.readFileSync('data.json', 'utf8'));
    }

    return {};
  }

  private saveData(data: any) {
    fs.writeFileSync('data.json', JSON.stringify(data));
  }
}
