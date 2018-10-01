import ITransformer from './transformer';
import * as mask from 'json-mask';
import MaskConverter from '../../shared/mask/mask.converter';
import MaskInput from '../../shared/mask/mask.input';

export default class JsonToJsonMaskedTransformer implements ITransformer {
  constructor(private maskInput: MaskInput, private maskConverter: MaskConverter) {}

  private readonly supportedType = 'json';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(
    source: { [key: string]: object },
    {
      langCode,
      mergeLanguages,
      filters,
    }: {
      langCode?: string;
      mergeLanguages?: boolean;
      filters?: string[];
    }
  ): { [key: string]: object } {
    const { tags, ...translations } = source;
    if (filters && filters.length > 0) {
      const maskInput = this.maskInput.convert(filters);
      const filtersMask = this.maskConverter.convert(maskInput, tags);
      const maskedTranslations = mask(translations, filtersMask);

      return maskedTranslations;
    }
    return translations;
  }
}
