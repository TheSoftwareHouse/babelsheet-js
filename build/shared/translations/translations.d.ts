export default interface ITranslations {
    clearTranslations(version: string): Promise<void>;
    setTranslations(filters: string[], translations: {
        [key: string]: any;
    }, version: string, format?: string): Promise<void>;
    getTranslations(filters: string[], version: string, format?: string): Promise<{
        [key: string]: any;
    }>;
}
