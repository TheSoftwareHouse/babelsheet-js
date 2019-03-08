import IStorage from '../../infrastructure/storage/storage';
import { ITransformers } from '../transformers/transformers.types';
import ITranslations from './translations';
import TranslationsKeyGenerator from './translations.key-generator';
export default class CachedTranslations implements ITranslations {
    private storage;
    private translationsKeyGenerator;
    private maskedTranslations;
    private transformers;
    private readonly translationsCachePrefix;
    constructor(storage: IStorage, translationsKeyGenerator: TranslationsKeyGenerator, maskedTranslations: ITranslations, transformers: ITransformers);
    clearTranslations(): Promise<void>;
    setTranslations(filters: string[], translations: {
        [key: string]: any;
    }, version: string, format?: string): Promise<void>;
    getTranslations(filters: string[], format: string, version: string): Promise<{
        [key: string]: any;
    }>;
}
