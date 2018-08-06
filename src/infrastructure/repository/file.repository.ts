import * as fs from 'fs';
import { ILogger } from 'node-common';
import IFileRepository from './file-repository.types';
import { Permission } from './file-repository.types';

export default class FileRepository implements IFileRepository {
  constructor(private logger: ILogger) {}
  public checkAccess(path: string, permission: Permission): boolean {
    try {
      fs.accessSync(path, permission === Permission.Read ? fs.constants.R_OK : fs.constants.W_OK);
      return true;
    } catch (err) {
      this.logger.error(`No access to '${path}'`);
      return false;
    }
  }

  public loadData(filename: string, extension: string): any {
    const fileName = `${filename}.${extension}`;
    if (fs.existsSync(fileName)) {
      return fs.readFileSync(fileName, 'utf8');
    }

    return null;
  }

  public saveData(data: any, filename: string, extension: string, path: string = '.'): void {
    fs.writeFileSync(`${path}/${filename}.${extension}`, data);
  }
}
