import IFileRepository from '../../../infrastructure/repository/file-repository.types';

export default class JsonFilesCreator implements IFilesCreator {
  private supportedExtension = 'json';
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
      this.fileRepository.saveData(data.content, data.lang, this.supportedExtension, path);
    });
  }
}
