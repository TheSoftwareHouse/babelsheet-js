import * as fs from 'fs';
import IStorage from './storage';
import IFileRepository from '../repository/file-repository.types';

export default class InFileStorage implements IStorage {
  constructor(private fileRepository: IFileRepository) {}

  public async set(key: string, value: any) {
    this.saveData({ ...this.loadData(), [key]: value });
  }

  public async get(key: string): Promise<any> {
    return this.loadData()[key];
  }

  public async has(key: string) {
    return Boolean(await this.get(key));
  }

  public async clear() {
    this.saveData({});
  }

  private loadData() {
    return JSON.parse(this.fileRepository.loadData('data', 'json'));
  }

  private saveData(data: any) {
    this.fileRepository.saveData(JSON.stringify(data), 'data', 'json');
  }
}
