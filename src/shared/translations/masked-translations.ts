import IStorage from '../../infrastructure/storage/storage';
import NotFoundError from '../error/not-found';
import ITransformer, { ITranslationsData } from '../transformers/transformer';
import ITranslations from './translations';

export default class MaskedTranslations implements ITranslations {
  private readonly translationsKey = 'translations';

  constructor(private storage: IStorage, private jsonToJsonMaskedTransformer: ITransformer) {}

  public async clearTranslations() {
    return this.storage.clear();
  }

  public async setTranslations(filters: string[], translations: { [key: string]: any }) {
    return this.storage.set(this.translationsKey, translations);
  }

  public async getTranslations(
    filters: string[],
    { keepLocale, comments }: { keepLocale?: boolean; comments?: boolean } = {}
  ): Promise<ITranslationsData> {
    const source = await this.storage.get(this.translationsKey);
    if (!source) {
      return Promise.reject(new NotFoundError('Translations not found'));
    }

    const maskedTranslations = this.jsonToJsonMaskedTransformer.transform({
      ...source,
      meta: { ...source.meta, includeComments: comments, filters, mergeLanguages: true },
    });
    // if not keeping locales and there is only one key on the first level of result, and it can be found in locales list
    if (!keepLocale) {
      const keys = Object.keys(maskedTranslations.result);
      if (
        keys.length === 1 &&
        maskedTranslations.meta.locales &&
        maskedTranslations.meta.locales.some((locale: string) => locale === keys[0])
      ) {
        return {
          ...maskedTranslations,
          result: maskedTranslations.result[keys[0]],
          meta: { ...maskedTranslations.meta },
        };
      }
    }
    return maskedTranslations;
  }
}
