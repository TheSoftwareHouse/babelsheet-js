import * as fs from 'fs-extra';
import IFileRepository from '../../../infrastructure/repository/file-repository.types';
import { ITranslationsData } from '../../../shared/transformers/transformer';
import { IFilesCreator } from './files-creator.types';

export default class XlfFilesCreator implements IFilesCreator {
  private supportedExtension = 'xlf';

  constructor(private fileRepository: IFileRepository) {}

  public supports(extension: string): boolean {
    return extension.toLowerCase() === this.supportedExtension;
  }

  public save(dataToSave: ITranslationsData, path: string, filename: string): void {
    if (dataToSave.meta && dataToSave.meta.mergeLanguages === true) {
      this.createFolderAndSave(dataToSave.result.merged, path, filename);
      return;
    }
    if (dataToSave.meta && dataToSave.meta.langCode) {
      this.createFolderAndSave(
        dataToSave.result.find((element: any) => element.lang === dataToSave.meta.langCode).content,
        path,
        filename
      );
      return;
    }

    dataToSave.result.forEach((data: any) => this.createFolderAndSave(data.content, path, `messages.${data.lang}`));
  }

  private createFolderAndSave(data: string, folderName: string, fileName: string) {
    if (!fs.existsSync(folderName)) {
      fs.mkdirsSync(folderName);
    }

    this.fileRepository.saveData(data, fileName, this.supportedExtension, folderName);
  }
}
