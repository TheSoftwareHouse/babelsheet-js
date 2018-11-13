import ITransformer, { ITranslationsData } from './transformer';
export default class ChainTransformer implements ITransformer {
    private supportedType;
    private transformers;
    constructor(supportedType: string, transformers: ITransformer[]);
    supports(type: string): boolean;
    transform(source: ITranslationsData): ITranslationsData;
}
