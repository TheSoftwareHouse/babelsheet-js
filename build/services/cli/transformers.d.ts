import ITransformer from '../../shared/transformers/transformer';
export default class Transformers implements ITransformers {
    private transformers;
    constructor(transformers: ITransformer[]);
    transform(data: any, type: string, langCode?: string): Promise<any>;
}
