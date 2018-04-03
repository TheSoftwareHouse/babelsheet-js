import { set, get } from "dot-prop-immutable";
import Transformer from "./transformer";
import * as ramda from "ramda";

export default class ToJsonTransformer implements Transformer {
  private readonly metaTranslationKey = ">>>";
  private readonly metaTagKey = "###";
  private readonly outputTagsKey = "tags";

  private extractTags(source: string): string[] {
    return source.split(",").map(value => value.trim());
  }

  private valueHasLocale(value: string): boolean {
    return value.length > 0 && value !== this.metaTagKey && value !== this.metaTranslationKey;
  }

  private updateContext(context: string, row: string[], meta: string[]): string {
    return ramda.addIndex<string, string>(ramda.reduce)(
      (acc, element, index) => {
        if (element && index < meta.length && meta[index] === this.metaTranslationKey) {
          const contextSplit = acc.split(".");

          if (index > contextSplit.length) {
            return `${acc}.${element}`;
          } else {
            const slicedContext = contextSplit.slice(0, index - 1);

            return slicedContext.length === 0 ? element : `${slicedContext.join(".")}.${element}`;
          }
        }

        return acc;
      },
      context,
      row
    );
  }

  private updateTranslations(source: Object, context: string, row: string[], meta: string[]): Object {
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

  private updateTags(source: Object, context: string, row: string[], meta: string[]): Object {
    return ramda.addIndex<string, Object>(ramda.reduce)(
      (accRow, row, rowIndex) => {
        if (row && rowIndex < meta.length && meta[rowIndex] === this.metaTagKey) {
          return ramda.reduce(
            (accTag, tag) => {
              return set(accTag, `${this.outputTagsKey}.${tag}.${context}`, null);
            },
            accRow,
            this.extractTags(row)
          );
        }

        return accRow;
      },
      ramda.clone(source),
      row
    );
  }

  transform(source: { [key: string]: string[] }): Object {
    const sourceValues = ramda.values(source);
    const metaIndex = sourceValues.findIndex(row => row.some(value => value === this.metaTranslationKey));

    if (metaIndex > -1) {
      const sourceRows = sourceValues.slice(metaIndex + 1, sourceValues.length);
      const meta = sourceValues[metaIndex];

      return ramda.reduce(
        (accRow, row) => {
          const context = this.updateContext(accRow.context, row, meta);
          const withTranslations = this.updateTranslations(accRow.result, context, row, meta);
          const result = this.updateTags(withTranslations, context, row, meta);

          return { result, context };
        },
        { result: {}, context: "" },
        sourceRows
      ).result;
    }

    return {};
  }
}
