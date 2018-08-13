import ITransformer from './transformer';
export default class SpreadsheetToJsonTransformer implements ITransformer {
    private readonly metaTranslationKey;
    private readonly metaTagKey;
    private readonly outputTagsKey;
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: {
        [key: string]: string[];
    }, langCode?: string): object;
    private getLanguageTranslations;
    private extractTags;
    private valueHasLocale;
    private updateContext;
    private updateTranslations;
    private updateTags;
}
