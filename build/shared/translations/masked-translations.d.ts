import IStorage from '../../infrastructure/storage/storage';
import ITransformer, { ITranslationsData } from '../transformers/transformer';
import ITranslations from './translations';
export default class MaskedTranslations implements ITranslations {
    private storage;
    private jsonToJsonMaskedTransformer;
    private readonly translationsKey;
    constructor(storage: IStorage, jsonToJsonMaskedTransformer: ITransformer);
    clearTranslations(version: string): Promise<void>;
    setTranslations(filters: string[], translations: {
        [key: string]: any;
    }, version: string): Promise<void>;
    getTranslations(filters: string[], version: string, { keepLocale, includeComments }?: {
        keepLocale?: boolean;
        includeComments?: boolean;
    }): Promise<ITranslationsData>;
}
