import { ITranslationsData } from '../../../shared/transformers/transformer';
import { IFilesCreator } from './files-creator.types';

export default class FilesCreators {
  constructor(private filesCreators: IFilesCreator[]) {}

  public save(
    dataToSave: ITranslationsData,
    path: string,
    filename: string,
    extension: string,
    version: string,
    baseLang: string
  ): void {
    const fileCreator = this.filesCreators.find(creator => creator.supports(extension));

    if (!fileCreator) {
      throw new Error(`No support for saving ${extension} data type`);
    }

    return fileCreator.save(dataToSave, path, filename, version, baseLang);
  }
}
