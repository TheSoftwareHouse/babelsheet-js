import IStorage from '../../infrastructure/storage/storage';
import MaskConverter from '../mask/mask.converter';
import MaskInput from '../mask/mask.input';
import ITranslations from './translations';
export default class MaskedTranslations implements ITranslations {
    private storage;
    private maskInput;
    private maskConverter;
    private readonly translationsKey;
    constructor(storage: IStorage, maskInput: MaskInput, maskConverter: MaskConverter);
    clearTranslations(): Promise<void>;
    setTranslations(filters: string[], translations: {
        [key: string]: any;
    }): Promise<void>;
    getTranslations(filters: string[]): Promise<{
        [key: string]: any;
    }>;
}
