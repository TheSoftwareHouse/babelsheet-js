import IStorage from "../storage/storage";

export default class TranslationsStorage {
  private storage: IStorage;

  constructor(opts: any) {
    this.storage = opts.storage;
  }

  public async setTranslations(translations: object) {
    this.storage.set("translations", translations);
  }

  public async getTranslations(): Promise<object> {
    return this.storage.get("translations");
  }
}
