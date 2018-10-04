import ITransformer from './transformer';
export default class JsonToJsonFilteredTransformer implements ITransformer {
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }, langCode: string, mergeLanguages: boolean, filter: string[]): {
        [key: string]: string[];
    };
}
