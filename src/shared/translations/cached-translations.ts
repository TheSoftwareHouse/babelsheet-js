import * as ramda from 'ramda';
import TranslationsKeyGenerator from '../../api/translations/translations.key-generator';
import NotFoundError from '../error/not-found';
import IStorage from '../storage/storage';
import ITranslations from './translations';

export default class CachedTranslations implements ITranslations {
  private readonly translationsCachePrefix = 'translationsCache';

  constructor(
    private storage: IStorage,
    private translationsKeyGenerator: TranslationsKeyGenerator,
    private maskedTranslations: ITranslations
  ) {}

  public async hasTranslations(filters: string[]) {
    const translationsKey = this.translationsKeyGenerator.generateKey(this.translationsCachePrefix, filters);

    return this.storage.has(translationsKey);
  }

  public async clearTranslations() {
    return this.storage.clear();
  }

  public async setTranslations(filters: string[], translations: { [key: string]: any }) {
    const translationsKey = this.translationsKeyGenerator.generateKey(this.translationsCachePrefix, filters);

    return this.storage.set(translationsKey, translations);
  }

  public async getTranslations(filters: string[]): Promise<{ [key: string]: any }> {
    const translationsKey = this.translationsKeyGenerator.generateKey(this.translationsCachePrefix, filters);

    if (await this.storage.has(translationsKey)) {
      return this.storage.get(translationsKey);
    }

    return this.maskedTranslations.getTranslations(filters).then(async trans => {
      if (ramda.isEmpty(trans)) {
        return Promise.reject(new NotFoundError('Translations not found'));
      }

      await this.storage.set(translationsKey, trans);
      return trans;
    });
  }
}
