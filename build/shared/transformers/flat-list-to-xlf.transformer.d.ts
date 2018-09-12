import ITransformer from './transformer';
export default class FlatListToXlfTransformer implements ITransformer {
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: Array<{
        [key: string]: string;
    }>): string;
    private generateXlf;
}
