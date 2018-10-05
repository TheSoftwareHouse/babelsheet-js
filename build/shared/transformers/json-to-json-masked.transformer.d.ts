import MaskConverter from '../../shared/mask/mask.converter';
import MaskInput from '../../shared/mask/mask.input';
import ITransformer from './transformer';
export default class JsonToJsonMaskedTransformer implements ITransformer {
    private maskInput;
    private maskConverter;
    private readonly supportedType;
    constructor(maskInput: MaskInput, maskConverter: MaskConverter);
    supports(type: string): boolean;
    transform(source: {
        [key: string]: object;
    }, { filters, }: {
        filters?: string[];
    }): {
        [key: string]: object;
    };
}
