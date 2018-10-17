import ITransformer, { ITranslationsData } from './transformer';
export default class JsonToJsonTransformer implements ITransformer {
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: ITranslationsData): ITranslationsData;
}
