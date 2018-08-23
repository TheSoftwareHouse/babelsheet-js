import Storage from './storage';
import * as ramda from 'ramda';
import IFileRepository from '../repository/file-repository.types';

const envFileVars = [
  'CLIENT_ID',
  'CLIENT_SECRET',
  'SPREADSHEET_ID',
  'SPREADSHEET_NAME',
  'token',
  'REDIRECT_URI',
  'REDIS_HOST',
  'REDIS_PORT',
  'HOST',
  'PORT',
  'NODE_ENV',
  'APP_NAME',
  'LOGGING_LEVEL',
  'TRACING_SERVICE_HOST',
  'TRACING_SERVICE_PORT',
];

export default class InEnvStorage implements Storage {
  constructor(private fileRepository: IFileRepository) {}

  public async set(key: string, value: any) {
    process.env[key] = JSON.stringify(value);

    this.updateEnvsInFile();
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

  private updateEnvsInFile() {
    const envsForFile = ramda.pick(envFileVars, process.env);
    const result = Object.keys(envsForFile).reduce((sum, val) => `${sum}${val}=${envsForFile[val]}\n`, '');

    this.fileRepository.saveData(result, '', 'env');
  }

  private tryParse(value: any) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
}
