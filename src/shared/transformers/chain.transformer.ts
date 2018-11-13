import ITransformer, { ITranslationsData } from './transformer';

export default class ChainTransformer implements ITransformer {
  constructor(private supportedType: string, private transformers: ITransformer[]) {}

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    return this.transformers.reduce((result, transformer) => transformer.transform(result), source);
  }
}
