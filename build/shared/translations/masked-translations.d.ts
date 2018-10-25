import IStorage from '../../infrastructure/storage/storage';
import ITransformer, { ITranslationsData } from '../transformers/transformer';
import ITranslations from './translations';
export default class MaskedTranslations implements ITranslations {
    private storage;
    private jsonToJsonMaskedTransformer;
    private readonly translationsKey;
    constructor(storage: IStorage, jsonToJsonMaskedTransformer: ITransformer);
    clearTranslations(): Promise<void>;
    setTranslations(filters: string[], translations: {
        [key: string]: any;
    }): Promise<void>;
    getTranslations(filters: string[], { keepLocale, includeComments }?: {
        keepLocale?: boolean;
        includeComments?: boolean;
    }): Promise<ITranslationsData>;
}
