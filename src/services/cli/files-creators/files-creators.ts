export default class FilesCreators {
  constructor(private filesCreators: IFilesCreator[]) {}

  public save(dataToSave: object[] | string, path: string, filename: string, extension: string): void {
    const fileCreator = this.filesCreators.find(creator => creator.supports(extension));

    if (!fileCreator) {
      throw new Error(`No support for xyz data type`);
    }

    return fileCreator.save(dataToSave, path, filename);
  }
}
