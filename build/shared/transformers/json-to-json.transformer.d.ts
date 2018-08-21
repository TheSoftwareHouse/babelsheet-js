import ITransformer from './transformer';
export default class JsonToJsonTransformer implements ITransformer {
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }): {
        [key: string]: string[];
    };
}
