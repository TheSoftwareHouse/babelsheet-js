import * as fs from 'fs';
import { ILogger } from 'node-common';
import IFileRepository from './file-repository.types';
import { Permission } from './file-repository.types';

export default class FileRepository implements IFileRepository {
  constructor(private logger: ILogger) {}

  public hasAccess(path: string, permission: Permission): boolean {
    try {
      fs.accessSync(path, permission === Permission.Read ? fs.constants.R_OK : fs.constants.W_OK);
      return true;
    } catch (err) {
      return false;
    }
  }

  public loadData(filename: string, extension: string): string | null {
    const fileName = `${filename}.${extension}`;
    if (fs.existsSync(fileName)) {
      return fs.readFileSync(fileName, 'utf8');
    }

    return null;
  }

  public saveData(data: string, filename: string, extension: string, path: string = '.'): void {
    fs.writeFileSync(`${path}/${filename}.${extension}`, data);
  }
}
