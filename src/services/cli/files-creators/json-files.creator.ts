import * as fs from 'fs';
import IFileRepository from '../../../infrastructure/repository/file-repository.types';
import { toSuffix } from '../../../shared/get-version-suffix';

export default class JsonFilesCreator implements IFilesCreator {
  private supportedExtension = 'json';
  constructor(private fileRepository: IFileRepository) {}

  public supports(extension: string): boolean {
    return extension.toLowerCase() === this.supportedExtension;
  }

  public save(
    dataToSave: Array<{ lang: string; content: string }> | string,
    path: string,
    filename: string,
    version: string
  ): void {
    if (typeof dataToSave === 'string') {
      this.createFolderAndSave(dataToSave, path, filename + toSuffix(version));
      return;
    }

    dataToSave.forEach((data: any) => {
      this.createFolderAndSave(data.content, path, data.lang + toSuffix(version));
    });
  }

  private createFolderAndSave(data: string, folderName: string, fileName: string) {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }

    this.fileRepository.saveData(data, fileName, this.supportedExtension, folderName);
  }
}
