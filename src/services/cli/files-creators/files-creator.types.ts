interface IFilesCreator {
  supports(extension: string): boolean;
  save(
    dataToSave: Array<{ lang: string; content: string }> | string,
    path: string,
    filename: string,
    version: string,
    baseLang?: string
  ): void;
}
