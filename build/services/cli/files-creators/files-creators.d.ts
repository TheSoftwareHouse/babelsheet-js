export default class FilesCreators {
    private filesCreators;
    constructor(filesCreators: IFilesCreator[]);
    save(dataToSave: Array<{
        lang: string;
        content: string;
    }> | string, path: string, filename: string, extension: string, baseLang: string): void;
}
