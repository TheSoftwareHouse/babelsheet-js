import * as fs from 'fs-extra';
import IFileRepository from '../../../infrastructure/repository/file-repository.types';
import { toSuffix } from '../../../shared/get-version-suffix';
import { ITranslationsData } from '../../../shared/transformers/transformer';
import { IFilesCreator } from './files-creator.types';

export default class IosFilesCreator implements IFilesCreator {
  private supportedExtension = 'strings';
  private defaultFileName = 'Localizable';
  constructor(private fileRepository: IFileRepository) {}

  public supports(extension: string): boolean {
    return extension.toLowerCase() === this.supportedExtension;
  }

  public save(dataToSave: ITranslationsData, path: string, filename: string, version: string, baseLang: string): void {
    if (dataToSave.meta && dataToSave.meta.mergeLanguages === true) {
      this.createFolderAndSave(dataToSave.result.merged, path, filename + toSuffix(version));
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
    dataToSave.result.forEach((data: any) => {
      const langWithLocale = this.transformLangWithRegion(data.lang);
      const folderName = `${path}/${version}/${langWithLocale}.lproj`;

      this.createFolderAndSave(data.content, folderName);
    });

    this.generateBaseTranslations(dataToSave.result, path, baseLang, version);
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

  private createFolderAndSave(data: string, folderName: string, filename?: string) {
    if (!fs.existsSync(folderName)) {
      fs.mkdirsSync(folderName);
    }

    this.fileRepository.saveData(data, filename || this.defaultFileName, this.supportedExtension, folderName);
  }

  private generateBaseTranslations(
    dataToSave: Array<{ lang: string; content: string }>,
    path: string,
    baseLang: string,
    version: string
  ) {
    const baseTranslations: any = dataToSave.find(
      (translation: any) => translation.lang.toLowerCase().indexOf(baseLang.toLowerCase()) !== -1
    );

    if (baseTranslations) {
      const folderName = `${path}/${version}/Base.lproj`;

      this.createFolderAndSave(baseTranslations.content, folderName);
    }
  }
}
