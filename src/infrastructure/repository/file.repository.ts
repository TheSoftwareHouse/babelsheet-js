import * as fs from 'fs';
import IFileRepository from './file-repository.types';

export default class FileRepository implements IFileRepository {
  public loadData(filename: string = 'data', extension: string = 'json'): any {
    const fileName = `${filename}.${extension}`;
    if (fs.existsSync(fileName)) {
      return fs.readFileSync(fileName, 'utf8');
    }

    return null;
  }

  public saveData(data: any, filename: string = 'data', extension: string = 'json') {
    fs.writeFileSync(`${filename}.${extension}`, data);
  }
}
