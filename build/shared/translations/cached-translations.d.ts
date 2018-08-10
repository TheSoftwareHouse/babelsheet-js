import IStorage from '../../infrastructure/storage/storage';
import ITranslations from './translations';
import TranslationsKeyGenerator from './translations.key-generator';
export default class CachedTranslations implements ITranslations {
    private storage;
    private translationsKeyGenerator;
    private maskedTranslations;
    private readonly translationsCachePrefix;
    constructor(storage: IStorage, translationsKeyGenerator: TranslationsKeyGenerator, maskedTranslations: ITranslations);
    hasTranslations(filters: string[]): Promise<boolean>;
    clearTranslations(): Promise<void>;
    setTranslations(filters: string[], translations: {
        [key: string]: any;
    }): Promise<void>;
    getTranslations(filters: string[]): Promise<{
        [key: string]: any;
    }>;
}
