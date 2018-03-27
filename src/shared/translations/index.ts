import Storage from "../storage";

export default class TranslationsStorage {
  private storage: Storage;

  constructor(opts: any) {
    this.storage = opts.storage;

    if (!this.translations) {
      this.translations = {};
    }
  }

  set translations(translations: any) {
    this.storage.set("translations", translations);
  }

  get translations(): any {
    return this.storage.get("translations");
  }
}
