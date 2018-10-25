import { set } from 'dot-prop-immutable';
import * as ramda from 'ramda';
import ITransformer, { ITranslationsData } from './transformer';

export default class SpreadsheetToJsonTransformer implements ITransformer {
  private readonly metaTranslationKey = '>>>';
  private readonly metaTagKey = '###';
  private readonly outputTagsKey = 'tags';
  private readonly outputTranslationsKey = 'translations';
  private readonly metaCommentsKey = '$$$';
  private readonly outputCommentsKey = 'comments';
  private readonly supportedType = 'json-obj';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    // find the meta info row (information about colums purpose)
    const metaIndex = source.result.findIndex((row: string[]) => row.some(value => value === this.metaTranslationKey));

    if (metaIndex > -1) {
      // parse data only after the meta info row
      const sourceRows = source.result.slice(metaIndex + 1, source.result.length);
      const meta = source.result[metaIndex];
      const metaInfo = {
        translationKeysStartIndex: meta.findIndex((element: string) => element === this.metaTranslationKey),
      };
      const parsed = ramda.reduce(
        (accRow: { translationsData: object; context: string }, row: string[]) => {
          const context = this.updateContext(accRow.context, row, meta, metaInfo);
          const withTranslations = this.updateTranslations(accRow.translationsData, context, row, meta);
          const withTags = this.updateTags(withTranslations, context, row, meta);
          const translationsData = this.updateComments(withTags, context, row, meta);
          return { translationsData, context };
        },
        { translationsData: {}, context: '' },
        sourceRows
      ).translationsData;

      const locales = meta.filter((key: string) => this.valueHasLocale(key));

      const result = {
        ...source,
        ...parsed,
        meta: {
          ...source.meta,
          locales,
        },
        result: (parsed as any)[this.outputTranslationsKey],
      };

      if (source.meta.langCode) {
        return this.getLanguageTranslations(result, source.meta.langCode);
      }

      return result;
    }

    return {
      translations: {},
      result: {},
      meta: {},
    };
  }

  private getLanguageTranslations(result: any, langCode: string) {
    const langCodeWithCase =
      result[this.outputTranslationsKey] &&
      Object.keys(result[this.outputTranslationsKey]).find(key => key.toLowerCase() === langCode.toLowerCase());

    if (!langCodeWithCase) {
      throw new Error(`No translations for '${langCode}' language code`);
    }

    const languageTranslations = ramda.clone(result);
    languageTranslations.result = result[this.outputTranslationsKey][langCodeWithCase];
    return languageTranslations;
  }

  private extractTags(source: string): string[] {
    return source.split(',').map(value => value.trim());
  }

  private valueHasLocale(value: string): boolean {
    return (
      value.length > 0 &&
      value !== this.metaTagKey &&
      value !== this.metaCommentsKey &&
      value !== this.metaTranslationKey
    );
  }

  private updateContext(
    context: string,
    row: string[],
    meta: string[],
    { translationKeysStartIndex }: { translationKeysStartIndex: number }
  ): string {
    return ramda.addIndex<string, string>(ramda.reduce)(
      (acc: string, element: string, index: number) => {
        // each row has a single element in the translation keys columns, and the content is divided into rows.
        // The nested keys need to be taken into account - they are passed as "context".
        if (element && index < meta.length && meta[index] === this.metaTranslationKey) {
          // if an element is found in the translation keys column, it needs to be added to the existing context.
          // if it is deeper than existing context it needs to be added, or replaced otherwise.
          // contextSplit has length 1 when no context is defined ("".split(".") results in [""])
          // index takes into account the columns preceding translation keys columns, so it needs to be adjusted
          const contextSplit = acc.split('.');

          if (index - translationKeysStartIndex + 1 > contextSplit.length) {
            return `${acc}.${element}`;
          } else {
            const slicedContext = contextSplit.slice(0, index - translationKeysStartIndex);
            return slicedContext.length === 0 ? element : `${slicedContext.join('.')}.${element}`;
          }
        }
        // return the new context.
        // TODO: maybe this could be shortcut'ed with https://ramdajs.com/docs/#reduced
        return acc;
      },
      context,
      row
    );
  }
  private updateTranslations(source: object, context: string, row: string[], meta: string[]): object {
    return ramda.addIndex(ramda.reduce)(
      (acc: object, element: any, index: number) => {
        // meta row has locale name at the translated value index. The locale is used as the first key part of the parsed data, and put into the data object
        if (element && index < meta.length && this.valueHasLocale(meta[index])) {
          return set(acc, `${this.outputTranslationsKey}.${meta[index]}.${context}`, element);
        }

        return acc;
      },
      ramda.clone(source),
      row
    );
  }

  private updateTags(source: object, context: string, row: string[], meta: string[]): object {
    return ramda.addIndex<string, object>(ramda.reduce)(
      (accRow: object, rowElement: string, rowIndex: number) => {
        // if the row has any data in the tags column, add it to the output object under tags key
        if (rowElement && rowIndex < meta.length && meta[rowIndex] === this.metaTagKey) {
          return ramda.reduce(
            (accTag: object, tag: string) => {
              return set(accTag, `${this.outputTagsKey}.${tag}.${context}`, null);
            },
            accRow,
            this.extractTags(rowElement)
          );
        }
        return accRow;
      },
      ramda.clone(source),
      row
    );
  }

  private updateComments(source: object, context: string, row: string[], meta: string[]): object {
    return ramda.addIndex<string, object>(ramda.reduce)(
      (accRow: object, rowElement: string, rowIndex: number) => {
        // if the row has any data in the comments column, add it to the output object under comments key
        if (rowElement && rowIndex < meta.length && meta[rowIndex] === this.metaCommentsKey) {
          return set(accRow, `${this.outputCommentsKey}.${context}`, rowElement);
        }
        return accRow;
      },
      ramda.clone(source),
      row
    );
  }
}
