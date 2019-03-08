import * as mask from 'json-mask';
import IStorage from '../../infrastructure/storage/storage';
import NotFoundError from '../error/not-found';
import { toSuffix } from '../get-version-suffix';
import MaskConverter from '../mask/mask.converter';
import MaskInput from '../mask/mask.input';
import ITranslations from './translations';

export default class MaskedTranslations implements ITranslations {
  private readonly translationsKey = 'translations';

  constructor(private storage: IStorage, private maskInput: MaskInput, private maskConverter: MaskConverter) {}

  public async clearTranslations(version: string) {
    const key = this.translationsKey + toSuffix(version);
    return this.storage.clear(key);
  }

  public async setTranslations(filters: string[], translations: { [key: string]: any }, version: string) {
    return this.storage.set(this.translationsKey + toSuffix(version), translations);
  }

  public async getTranslations(filters: string[], version: string, format?: string): Promise<{ [key: string]: any }> {
    const translationsWithTags = await this.storage.get(this.translationsKey + toSuffix(version));

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
