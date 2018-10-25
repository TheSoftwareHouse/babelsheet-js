import FilesCreators from '../services/cli/files-creators/files-creators';
import { ITranslationsData } from '../shared/transformers/transformer';
export default class FakeFilesCreators {
    private innerFilesCreators;
    private basePath;
    constructor(innerFilesCreators: FilesCreators, basePath: string);
    save(dataToSave: ITranslationsData, path: string, filename: string, extension: string, baseLang: string): void;
}
