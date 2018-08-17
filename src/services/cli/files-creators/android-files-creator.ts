import * as fs from 'fs';
import IFileRepository from '../../../infrastructure/repository/file-repository.types';

export default class AndroidFilesCreator implements IFilesCreator {
  private supportedExtension = 'xml';
  private defaultFileName = 'strings';
  constructor(private fileRepository: IFileRepository) {}

  public supports(extension: string): boolean {
    return extension.toLowerCase() === this.supportedExtension;
  }

  public save(dataToSave: object[] | string, path: string, filename: string): void {
    if (typeof dataToSave === 'string') {
      this.fileRepository.saveData(dataToSave, filename, this.supportedExtension, path);
      return;
    }

    dataToSave.forEach((data: any) => {
      const langWithLocale = data.lang.split(/[-_]{1}/).join('-r');
      const folderName = `${path}/values-${langWithLocale}`;
      fs.mkdirSync(folderName);
      this.fileRepository.saveData(data.content, this.defaultFileName, this.supportedExtension, folderName);
    });
  }
}
