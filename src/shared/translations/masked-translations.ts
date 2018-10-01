import IStorage from '../../infrastructure/storage/storage';
import NotFoundError from '../error/not-found';
import ITranslations from './translations';
import ITransformer from "../transformers/transformer";

export default class MaskedTranslations implements ITranslations {
  private readonly translationsKey = 'translations';

  constructor(private storage: IStorage,
    private jsonToJsonMaskedTransformer: ITransformer) {}

  public async clearTranslations() {
    return this.storage.clear();
  }

  public async setTranslations(filters: string[], translations: { [key: string]: any }) {
    return this.storage.set(this.translationsKey, translations);
  }

  public async getTranslations(filters: string[]): Promise<{ [key: string]: any }> {
    const translationsWithTags = await this.storage.get(this.translationsKey);

    if (!translationsWithTags) {
      return Promise.reject(new NotFoundError('Translations not found'));
    }

    const maskedTranslations = this.jsonToJsonMaskedTransformer.transform(translationsWithTags,undefined,undefined, filters);

    return Promise.resolve(maskedTranslations);
  }
}
