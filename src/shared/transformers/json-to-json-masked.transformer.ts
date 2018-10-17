import * as mask from 'json-mask';
import MaskConverter from '../../shared/mask/mask.converter';
import MaskInput from '../../shared/mask/mask.input';
import ITransformer, { ITranslationsData } from './transformer';

export default class JsonToJsonMaskedTransformer implements ITransformer {
  private readonly supportedType = 'json';

  constructor(private maskInput: MaskInput, private maskConverter: MaskConverter) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    if (source.meta.filters && source.meta.filters.length) {
      const maskInput = this.maskInput.convert(source.meta.filters);
      const filtersMask = this.maskConverter.convert(maskInput, source.tags || {});
      const maskedTranslations = mask(source.result, filtersMask);
      return { ...source, result: maskedTranslations };
    }
    return source;
  }
}
