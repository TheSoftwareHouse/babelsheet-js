import ITransofrmer, { ITranslationsData } from './transformer';

export default class JsonToYamlTransformer implements ITransofrmer {
  private readonly supportedType = 'json-yml';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    if (source.meta.mergeLanguages) {
      return {
        ...source,
        result: { merged: this.generateYaml(source.result, source.meta.includeComments ? source.comments : undefined) },
      };
    } else if (source.meta.langCode) {
      return {
        ...source,
        result: [
          {
            lang: source.meta.langCode,
            content: this.generateYaml(source.result, source.meta.includeComments ? source.comments : undefined),
          },
        ],
      };
    } else {
      return {
        ...source,
        result: Object.keys(source.result).map(lang => ({
          lang,
          content: this.generateYaml(source.result[lang], source.meta.includeComments ? source.comments : undefined),
        })),
      };
    }
  }

  public generateYaml(json: object, comments?: any) {
    const jsonToYaml = (
      current: any,
      source: object,
      upperKey?: string,
      context: string[] = [],
      yaml: string = '',
      level: number = 0
    ): string => {
      // if its an object, go deeper
      if (typeof current === 'object') {
        return `${yaml}${'  '.repeat(Math.max(level - 1, 0))}${upperKey ? upperKey + ':\n' : ''}${Object.keys(
          current
        ).reduce((accumulator, key) => {
          return jsonToYaml(current[key], source, key, [...context, key], accumulator, level + 1);
        }, '')}`;
      }
      // if its not an object, add it to yml. Check for comments existence first, if they were passed.
      else {
        let comment;
        if (comments) {
          comment = context.reduce((previous, key) => {
            return previous && previous[key];
          }, comments);
        }
        return `${yaml}${'  '.repeat(Math.max(level - 1, 0))}${upperKey}: ${current}${comment ? ` #${comment}` : ''}\n`;
      }
    };
    return jsonToYaml(json, json);
  }
}
