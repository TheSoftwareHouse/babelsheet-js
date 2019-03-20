import IFileRepository from '../../../infrastructure/repository/file-repository.types';
import { ITranslationsData } from '../../../shared/transformers/transformer';
import { IFilesCreator } from './files-creator.types';
export default class AndroidFilesCreator implements IFilesCreator {
    private fileRepository;
    private supportedExtension;
    private defaultFileName;
    constructor(fileRepository: IFileRepository);
    supports(extension: string): boolean;
    save(dataToSave: ITranslationsData, path: string, filename: string, version: string, baseLang: string): void;
    private transformLangWithRegion;
    private createFolderAndSave;
    private generateBaseTranslations;
}
