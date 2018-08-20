import * as fs from 'fs';
import IFileRepository from '../../../infrastructure/repository/file-repository.types';

export default class IosFilesCreator implements IFilesCreator {
  private supportedExtension = 'strings';
  private defaultFileName = 'Localizable';
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
      const folderName = `${path}/${data.lang}.lproj`;
      fs.mkdirSync(folderName);
      this.fileRepository.saveData(data.content, this.defaultFileName, this.supportedExtension, folderName);
    });
  }
}
