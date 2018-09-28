import ITransformer from './transformer';
import MaskConverter from '../../shared/mask/mask.converter';
import MaskInput from '../../shared/mask/mask.input';
export default class JsonToJsonMaskedTransformer implements ITransformer {
    private maskInput;
    private maskConverter;
    constructor(maskInput: MaskInput, maskConverter: MaskConverter);
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: {
        [key: string]: object;
    }, langCode: string, mergeLanguages: boolean, filters: string[]): {
        [key: string]: object;
    };
}
