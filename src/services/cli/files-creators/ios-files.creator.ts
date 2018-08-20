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

    const dataWithoutTags = dataToSave.filter((translations: any) => translations.lang !== 'tags');
    dataWithoutTags.forEach((data: any) => {
      const langWithLocale = this.transformLangWithRegion(data.lang);
      const folderName = `${path}/${langWithLocale}.lproj`;
      fs.mkdirSync(folderName);
      this.fileRepository.saveData(data.content, this.defaultFileName, this.supportedExtension, folderName);
    });
  }

  private transformLangWithRegion(languageCode: string): string {
    const langWithLocale = languageCode.split(/[-_]{1}/);
    if (langWithLocale.length > 1 && langWithLocale[0].toLocaleLowerCase() === langWithLocale[1].toLocaleLowerCase()) {
      return langWithLocale[0].toLowerCase();
    }
    return languageCode;
  }
}
