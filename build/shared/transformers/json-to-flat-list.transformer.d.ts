import ITransformer, { ITranslationsData } from './transformer';
export default class JsonToFlatListTransformer implements ITransformer {
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: ITranslationsData): ITranslationsData;
    private prepareCommentsKey;
}
