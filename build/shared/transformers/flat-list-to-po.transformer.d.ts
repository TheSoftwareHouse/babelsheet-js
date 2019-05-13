import ITransformer, { ITranslationsData } from './transformer';
export default class FlatListToPoTransformer implements ITransformer {
    private static checkIfSingleLanguageRequested;
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: ITranslationsData): ITranslationsData;
    private generatePo;
}
