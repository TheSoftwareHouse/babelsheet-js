import ITransformer from '../../shared/transformers/transformer';

export default class Transformers implements ITransformers {
  constructor(private transformers: ITransformer[]) {}

  async transform(data: any, type: string) {
    const transformer = this.transformers.find(transformer => transformer.supports(type));

    if (!transformer) {
      throw new Error(`No support for ${type} data type`);
    }

    return await transformer.transform(data);
  }
}
