import ITransformer, { ITranslationsData } from './transformer';
import { ITransformers } from './transformers.types';

export default class Transformers implements ITransformers {
  constructor(private transformers: ITransformer[]) {}

  public async transform(data: ITranslationsData, type: string): Promise<ITranslationsData> {
    const transformer = type && this.transformers.find(trans => trans.supports(type));

    if (!transformer) {
      throw new Error(`No support for ${type} data type`);
    }
    return await transformer.transform(data);
  }
}
