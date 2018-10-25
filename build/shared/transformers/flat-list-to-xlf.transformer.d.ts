import ITransformer, { ITranslationsData } from './transformer';
export default class FlatListToXlfTransformer implements ITransformer {
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: ITranslationsData): ITranslationsData;
    private generateXlf;
}
