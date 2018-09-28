import ITransformer from './transformer';
import { ITransformers } from './transformers.types';
export default class Transformers implements ITransformers {
    private transformers;
    constructor(transformers: ITransformer[]);
    transform(data: any, type: string, langCode?: string, mergeLanguages?: boolean, filters?: string[]): Promise<any>;
}
