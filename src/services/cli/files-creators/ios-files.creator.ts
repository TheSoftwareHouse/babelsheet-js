import * as fs from 'fs';
import IFileRepository from '../../../infrastructure/repository/file-repository.types';

export default class IosFilesCreator implements IFilesCreator {
  private supportedExtension = 'strings';
  private defaultFileName = 'Localizable';
  constructor(private fileRepository: IFileRepository) {}

  public supports(extension: string): boolean {
    return extension.toLowerCase() === this.supportedExtension;
  }

  public save(
    dataToSave: Array<{ lang: string; content: string }> | string,
    path: string,
    filename: string,
    baseLang: string
  ): void {
    if (typeof dataToSave === 'string') {
      this.fileRepository.saveData(dataToSave, filename, this.supportedExtension, path);
      return;
    }

    const dataWithoutTags = dataToSave.filter((translations: any) => translations.lang !== 'tags');
    dataWithoutTags.forEach((data: any) => {
      const langWithLocale = this.transformLangWithRegion(data.lang);
      const folderName = `${path}/${langWithLocale}.lproj`;

      this.createFolderAndSave(data.content, folderName);
    });

    this.generateBaseTranslations(dataToSave, path, baseLang);
  }

  private transformLangWithRegion(languageCode: string): string {
    const langWithLocale = languageCode.split(/[-_]{1}/);

    if (langWithLocale.length > 1) {
      if (langWithLocale[0].toLocaleLowerCase() === langWithLocale[1].toLocaleLowerCase()) {
        return langWithLocale[0].toLowerCase();
      }
      return langWithLocale.join('-');
    }

    return languageCode;
  }

  private createFolderAndSave(data: string, folderName: string) {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }

    this.fileRepository.saveData(data, this.defaultFileName, this.supportedExtension, folderName);
  }

  private generateBaseTranslations(
    dataToSave: Array<{ lang: string; content: string }>,
    path: string,
    baseLang: string
  ) {
    const baseTranslations: any = dataToSave.find(
      (translation: any) => translation.lang.toLowerCase().indexOf(baseLang.toLowerCase()) !== -1
    );

    if (baseTranslations) {
      const folderName = `${path}/Base.lproj`;

      this.createFolderAndSave(baseTranslations.content, folderName);
    }
  }
}
