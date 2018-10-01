import IStorage from '../../infrastructure/storage/storage';
import ITranslations from './translations';
import ITransformer from "../transformers/transformer";
export default class MaskedTranslations implements ITranslations {
    private storage;
    private jsonToJsonMaskedTransformer;
    private readonly translationsKey;
    constructor(storage: IStorage, jsonToJsonMaskedTransformer: ITransformer);
    clearTranslations(): Promise<void>;
    setTranslations(filters: string[], translations: {
        [key: string]: any;
    }): Promise<void>;
    getTranslations(filters: string[]): Promise<{
        [key: string]: any;
    }>;
}
