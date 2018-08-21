import ITransformer from './transformer';
export default class Transformers implements ITransformers {
    private transformers;
    constructor(transformers: ITransformer[]);
    transform(data: any, type: string, langCode?: string, mergeLanguages?: boolean): Promise<any>;
}
