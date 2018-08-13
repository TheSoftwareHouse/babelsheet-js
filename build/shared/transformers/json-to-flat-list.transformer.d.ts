import ITransformer from './transformer';
export default class JsonToFlatListTransformer implements ITransformer {
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: object): Array<{
        [key: string]: string;
    }>;
}
