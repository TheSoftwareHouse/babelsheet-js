import IFileRepository from '../../../infrastructure/repository/file-repository.types';
export default class JsonFilesCreator implements IFilesCreator {
    private fileRepository;
    private supportedExtension;
    constructor(fileRepository: IFileRepository);
    supports(extension: string): boolean;
    save(dataToSave: Array<{
        lang: string;
        content: string;
    }> | string, path: string, filename: string, version: string): void;
    private createFolderAndSave;
}
