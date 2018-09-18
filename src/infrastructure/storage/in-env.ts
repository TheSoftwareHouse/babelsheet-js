import * as ramda from 'ramda';
import FileRepository from '../repository/file.repository';
import Storage from './storage';

const envFileVars = [
  'BABELSHEET_CLIENT_ID',
  'BABELSHEET_CLIENT_SECRET',
  'BABELSHEET_SPREADSHEET_ID',
  'BABELSHEET_SPREADSHEET_NAME',
  'BABELSHEET_REFRESH_TOKEN',
  'BABELSHEET_REDIRECT_URI',
  'BABELSHEET_REDIS_HOST',
  'BABELSHEET_REDIS_PORT',
  'BABELSHEET_HOST',
  'BABELSHEET_PORT',
  'NODE_ENV',
  'APP_NAME',
  'LOGGING_LEVEL',
  'TRACING_SERVICE_HOST',
  'TRACING_SERVICE_PORT',
];

export default class InEnvStorage implements Storage {
  constructor(private fileRepository: FileRepository) {}

  public async set(key: string, value: any) {
    process.env[key.toUpperCase()] = JSON.stringify(value);

    this.updateEnvsInFile();
  }

  public async get(key: string) {
    return this.tryParse(process.env[key.toUpperCase()]);
  }

  public async has(key: string) {
    return Boolean(await this.get(key.toUpperCase()));
  }

  // tslint:disable-next-line
  public async clear() {}

  private updateEnvsInFile() {
    const envsForFile = ramda.pick(envFileVars, process.env);
    const result = Object.keys(envsForFile).reduce((sum, val) => `${sum}${val}=${envsForFile[val]}\n`, '');

    this.fileRepository.saveData(result, '', 'env.babelsheet');
  }

  private tryParse(value: any) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }
}
