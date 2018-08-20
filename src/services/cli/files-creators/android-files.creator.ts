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

    const dataWithoutTags = dataToSave.filter((translations: any) => translations.lang !== 'tags');
    dataWithoutTags.forEach((data: any) => {
      const langWithLocale = this.transformLangWithRegion(data.lang);
      const folderName = `${path}/values-${langWithLocale}`;
      fs.mkdirSync(folderName);
      this.fileRepository.saveData(data.content, this.defaultFileName, this.supportedExtension, folderName);
    });
  }

  private transformLangWithRegion(languageCode: string): string {
    const langWithLocale = languageCode.split(/[-_]{1}/);
    if (langWithLocale.length > 1) {
      if (langWithLocale[0].toLocaleLowerCase() === langWithLocale[1].toLocaleLowerCase()) {
        return langWithLocale[0].toLowerCase();
      }
      return langWithLocale.join('-r');
    }
    return languageCode;
  }
}
