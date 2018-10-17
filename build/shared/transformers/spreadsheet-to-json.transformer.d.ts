import ITransformer, { ITranslationsData } from './transformer';
export default class SpreadsheetToJsonTransformer implements ITransformer {
    private readonly metaTranslationKey;
    private readonly metaTagKey;
    private readonly outputTagsKey;
    private readonly outputTranslationsKey;
    private readonly metaCommentsKey;
    private readonly outputCommentsKey;
    private readonly supportedType;
    supports(type: string): boolean;
    transform(source: ITranslationsData): ITranslationsData;
    private getLanguageTranslations;
    private extractTags;
    private valueHasLocale;
    private updateContext;
    private updateTranslations;
    private updateTags;
    private updateComments;
}
