import * as ramda from 'ramda';
import IStorage from '../../infrastructure/storage/storage';
import NotFoundError from '../error/not-found';
import { getExtension, getExtensionsFromJson } from '../formatToExtensions';
import ITranslations from './translations';
import TranslationsKeyGenerator from './translations.key-generator';

export default class CachedTranslations implements ITranslations {
  private readonly translationsCachePrefix = 'translationsCache';

  constructor(
    private storage: IStorage,
    private translationsKeyGenerator: TranslationsKeyGenerator,
    private maskedTranslations: ITranslations,
    private transformers: ITransformers
  ) {}

  public async clearTranslations() {
    return this.storage.clear();
  }

  public async setTranslations(filters: string[], translations: { [key: string]: any }, format?: string) {
    const translationsKey = this.translationsKeyGenerator.generateKey(this.translationsCachePrefix, filters, format);

    return this.storage.set(translationsKey, translations);
  }

  public async getTranslations(filters: string[], format: string): Promise<{ [key: string]: any }> {
    const extension = getExtensionsFromJson(format);
    const translationsKey = this.translationsKeyGenerator.generateKey(this.translationsCachePrefix, filters, format);

    if (await this.storage.has(translationsKey)) {
      return await this.storage.get(translationsKey);
    }

    return this.maskedTranslations.getTranslations(filters).then(async trans => {
      if (ramda.isEmpty(trans)) {
        return Promise.reject(new NotFoundError('Translations not found'));
      }

      let transformedTranslations = await this.transformers.transform(trans, extension);

      await this.storage.set(translationsKey, transformedTranslations);
      return transformedTranslations;
    });
  }
}
