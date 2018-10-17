import ITransofrmer, { ITranslationsData } from './transformer';
export default class JsonToYamlTransformer implements ITransofrmer {
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: ITranslationsData): ITranslationsData;
    generateYaml(json: object, comments?: any): string;
}
