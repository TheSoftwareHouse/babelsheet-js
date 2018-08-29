export default class FilesCreators {
  constructor(private filesCreators: IFilesCreator[]) {}

  public save(
    dataToSave: Array<{ lang: string; content: string }> | string,
    path: string,
    filename: string,
    extension: string,
    baseLang: string
  ): void {
    const fileCreator = this.filesCreators.find(creator => creator.supports(extension));

    if (!fileCreator) {
      throw new Error(`No support for xyz data type`);
    }

    return fileCreator.save(dataToSave, path, filename, baseLang);
  }
}
