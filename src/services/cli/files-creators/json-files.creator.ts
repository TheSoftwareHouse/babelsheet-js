import * as fs from 'fs-extra';
import IFileRepository from '../../../infrastructure/repository/file-repository.types';
import { toSuffix } from '../../../shared/get-version-suffix';
import { ITranslationsData } from '../../../shared/transformers/transformer';
import { IFilesCreator } from './files-creator.types';

export default class JsonFilesCreator implements IFilesCreator {
  private supportedExtension = 'json';
  constructor(private fileRepository: IFileRepository) {}

  public supports(extension: string): boolean {
    return extension.toLowerCase() === this.supportedExtension;
  }

  public save(dataToSave: ITranslationsData, path: string, filename: string, version: string): void {
    if (dataToSave.meta && dataToSave.meta.mergeLanguages === true) {
      this.createFolderAndSave(dataToSave.result, path, filename + toSuffix(version));
      return;
    }
    if (dataToSave.meta && dataToSave.meta.langCode) {
      const translations = dataToSave.result[dataToSave.meta.langCode];
      this.createFolderAndSave(translations, path, filename + toSuffix(version));
      return;
    }
    dataToSave.result.forEach((data: any) => {
      this.createFolderAndSave(data.content, path, data.lang + toSuffix(version));
    });
  }

  private createFolderAndSave(data: string, folderName: string, fileName: string) {
    if (!fs.existsSync(folderName)) {
      fs.mkdirsSync(folderName);
    }

    this.fileRepository.saveData(data, fileName, this.supportedExtension, folderName);
  }
}
