import { ITranslationsData } from '../../../shared/transformers/transformer';
import { IFilesCreator } from './files-creator.types';
export default class FilesCreators {
    private filesCreators;
    constructor(filesCreators: IFilesCreator[]);
    save(dataToSave: ITranslationsData, path: string, filename: string, extension: string, baseLang: string): void;
}
