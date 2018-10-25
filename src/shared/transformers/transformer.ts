export default interface ITransformer {
  supports(type: string): boolean;
  transform(source: ITranslationsData | string[][]): ITranslationsData;
}

export interface ITranslationsData {
  translations: TranslationsDataNode;
  result: any;
  comments?: TranslationsDataNode;
  tags?: { [key: string]: TranslationsDataNode };
  meta: {
    includeComments?: boolean;
    langCode?: string;
    mergeLanguages?: boolean;
    filters?: string[];
    locales?: string[];
    [key: string]: any;
  };
}

export type TranslationsDataNode = { [key: string]: TranslationsDataNode } | string;
