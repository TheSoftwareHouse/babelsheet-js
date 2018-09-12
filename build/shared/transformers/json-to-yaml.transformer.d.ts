import ITransofrmer from './transformer';
export default class JsonToYamlTransformer implements ITransofrmer {
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }): string;
}
