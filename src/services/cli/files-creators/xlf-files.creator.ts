import * as fs from 'fs';
import IFileRepository from '../../../infrastructure/repository/file-repository.types';

export default class XlfFilesCreator implements IFilesCreator {
  private supportedExtension = 'xlf';

  constructor(private fileRepository: IFileRepository) {}

  public supports(extension: string): boolean {
    return extension.toLowerCase() === this.supportedExtension;
  }

  public save(dataToSave: Array<{ lang: string; content: string }>, path: string, filename: string): void {
    const dataWithoutTags = dataToSave.filter((translations: any) => translations.lang !== 'tags');
    dataWithoutTags.forEach((data: any) => this.createFolderAndSave(data.content, path, `messages.${data.lang}`));
  }

  private createFolderAndSave(data: string, folderName: string, fileName: string) {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }

    this.fileRepository.saveData(data, fileName, this.supportedExtension, folderName);
  }
}
