interface IFilesCreator {
    supports(extension: string): boolean;
    save(dataToSave: object[] | string, path: string, filename: string): void;
}
