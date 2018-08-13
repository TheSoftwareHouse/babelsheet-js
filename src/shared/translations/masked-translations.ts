import * as mask from 'json-mask';
import IStorage from '../../infrastructure/storage/storage';
import NotFoundError from '../error/not-found';
import MaskConverter from '../mask/mask.converter';
import MaskInput from '../mask/mask.input';
import ITranslations from './translations';

export default class MaskedTranslations implements ITranslations {
  private readonly translationsKey = 'translations';

  constructor(private storage: IStorage, private maskInput: MaskInput, private maskConverter: MaskConverter) {}

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

    const { tags, ...translations } = translationsWithTags;

    const maskInput = this.maskInput.convert(filters);
    const filtersMask = this.maskConverter.convert(maskInput, tags);
    const maskedTranslations = mask(translations, filtersMask);

    return Promise.resolve(maskedTranslations);
  }
}
