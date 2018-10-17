import ITransformer, { ITranslationsData } from './transformer';
import { ITransformers } from './transformers.types';
export default class Transformers implements ITransformers {
    private transformers;
    constructor(transformers: ITransformer[]);
    transform(data: ITranslationsData, type: string): Promise<ITranslationsData>;
}
