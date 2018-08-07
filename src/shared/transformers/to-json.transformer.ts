import { set } from 'dot-prop-immutable';
import * as ramda from 'ramda';
import ITransformer from './transformer';

export default class ToJsonTransformer implements ITransformer {
  private readonly metaTranslationKey = '>>>';
  private readonly metaTagKey = '###';
  private readonly outputTagsKey = 'tags';
  private supportedType = 'json';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: { [key: string]: string[] }): any {
    const sourceValues = ramda.values(source);
    const metaIndex = sourceValues.findIndex(row => row.some(value => value === this.metaTranslationKey));
    let data = {};

    if (metaIndex > -1) {
      const sourceRows = sourceValues.slice(metaIndex + 1, sourceValues.length);
      const meta = sourceValues[metaIndex];

      data = ramda.reduce(
        (accRow, row) => {
          const context = this.updateContext(accRow.context, row, meta);
          const withTranslations = this.updateTranslations(accRow.result, context, row, meta);
          const result = this.updateTags(withTranslations, context, row, meta);

          return { result, context };
        },
        { result: {}, context: '' },
        sourceRows
      ).result;
    }

    return JSON.stringify(data);
  }

  private extractTags(source: string): string[] {
    return source.split(',').map(value => value.trim());
  }

  private valueHasLocale(value: string): boolean {
    return value.length > 0 && value !== this.metaTagKey && value !== this.metaTranslationKey;
  }

  private updateContext(context: string, row: string[], meta: string[]): string {
    return ramda.addIndex<string, string>(ramda.reduce)(
      (acc, element, index) => {
        if (element && index < meta.length && meta[index] === this.metaTranslationKey) {
          const contextSplit = acc.split('.');

          if (index > contextSplit.length) {
            return `${acc}.${element}`;
          } else {
            const slicedContext = contextSplit.slice(0, index - 1);

            return slicedContext.length === 0 ? element : `${slicedContext.join('.')}.${element}`;
          }
        }

        return acc;
      },
      context,
      row
    );
  }

  private updateTranslations(source: object, context: string, row: string[], meta: string[]): object {
    return ramda.addIndex(ramda.reduce)(
      (acc, element, index) => {
        if (element && index < meta.length && this.valueHasLocale(meta[index])) {
          return set(acc, `${meta[index]}.${context}`, element);
        }

        return acc;
      },
      ramda.clone(source),
      row
    );
  }

  private updateTags(source: object, context: string, row: string[], meta: string[]): object {
    return ramda.addIndex<string, object>(ramda.reduce)(
      (accRow, rowElement, rowIndex) => {
        if (rowElement && rowIndex < meta.length && meta[rowIndex] === this.metaTagKey) {
          return ramda.reduce(
            (accTag, tag) => {
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
}
