import * as fs from 'fs';
import { IFileRepository, Permission } from './file-repository.types';
import { ILogger } from 'node-common';

export default class FileRepository implements IFileRepository {
  constructor(private logger: ILogger) {}
  public checkAccess(path: string, permission: Permission): Boolean {
    try {
      fs.accessSync(path, permission === Permission.Read ? fs.constants.R_OK : fs.constants.W_OK);
      return true;
    } catch (err) {
      this.logger.error('No permission to write');
      return false;
    }
  }

  public loadData(filename: string = 'data', extension: string = 'json'): any {
    const fileName = `${filename}.${extension}`;
    if (fs.existsSync(fileName)) {
      return fs.readFileSync(fileName, 'utf8');
    }

    return null;
  }

  public saveData(data: any, path: string = '.', filename: string = 'data', extension: string = 'json'): void {
    fs.writeFileSync(`${path}/${filename}.${extension}`, data);
  }
}
