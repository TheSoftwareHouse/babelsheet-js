import ITransformer from './transformer';
export default class FlatListToXmlTransformer implements ITransformer {
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: Array<{
        [key: string]: string;
    }>): string;
    private generateXml;
}
