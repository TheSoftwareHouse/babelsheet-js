import IFileRepository from '../repository/file-repository.types';
import Storage from './storage';

export default class InEnvStorage implements Storage {
  constructor(private fileRepository: IFileRepository) {}

  public async set(key: string, value: any) {
    process.env[key] = JSON.stringify(value);
  }

  public async get(key: string) {
    return Promise.resolve(this.tryParse(process.env[key]));
  }

  public async has(key: string) {
    return Promise.resolve(Boolean(await this.get(key)));
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
