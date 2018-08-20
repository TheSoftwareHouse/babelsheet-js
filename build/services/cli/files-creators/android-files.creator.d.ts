import IFileRepository from '../../../infrastructure/repository/file-repository.types';
export default class AndroidFilesCreator implements IFilesCreator {
    private fileRepository;
    private supportedExtension;
    private defaultFileName;
    constructor(fileRepository: IFileRepository);
    supports(extension: string): boolean;
    save(dataToSave: object[] | string, path: string, filename: string): void;
    private transformLangWithRegion;
}
