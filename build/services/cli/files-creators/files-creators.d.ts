export default class FilesCreators {
    private filesCreators;
    constructor(filesCreators: IFilesCreator[]);
    save(dataToSave: object[] | string, path: string, filename: string, extension: string): void;
}
