import * as nodepath from 'path';
import FilesCreators from '../services/cli/files-creators/files-creators';
import { ITranslationsData } from '../shared/transformers/transformer';
export default class FakeFilesCreators {
  constructor(private innerFilesCreators: FilesCreators, private basePath: string) {}

  public save(
    dataToSave: ITranslationsData,
    path: string,
    filename: string,
    extension: string,
    version: string,
    baseLang: string
  ): void {
    return this.innerFilesCreators.save(
      dataToSave,
      nodepath.join(this.basePath, path),
      filename,
      extension,
      version,
      baseLang
    );
  }
}
