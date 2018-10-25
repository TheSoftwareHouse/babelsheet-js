import * as YAML from 'yaml';
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
        result: {
          merged: this.generateYaml(
            source.result,
            source.meta.includeComments ? source.comments : undefined,
            source.meta.locales
          ),
        },
      };
    } else if (source.meta.langCode) {
      return {
        ...source,
        result: [
          {
            lang: source.meta.langCode,
            content: this.generateYaml(
              source.result,
              source.meta.includeComments ? source.comments : undefined,
              source.meta.locales
            ),
          },
        ],
      };
    } else {
      return {
        ...source,
        result: Object.keys(source.result).map(lang => ({
          lang,
          content: this.generateYaml(
            source.result[lang],
            source.meta.includeComments ? source.comments : undefined,
            source.meta.locales
          ),
        })),
      };
    }
  }

  public generateYaml(json: object, comments: any, locales?: string[]) {
    // change schema to force compatibility with previous yaml implementation
    const doc = new YAML.Document({ schema: 'yaml-1.1' });
    doc.contents = YAML.createNode(json) as any;
    // add comments
    const addComments = (node: any, context: string[]) => {
      //  map
      if (node.items) {
        node.items.forEach((item: any) => addComments(item, [...context, item.key.value]));
      }
      // pair with map as value
      else if (node.value && node.value.items) {
        node.value.items.forEach((item: any) => addComments(item, [...context, item.key.value]));
      }
      // value - check for comments
      else if (comments) {
        const comment = context.reduce((previous: any, key, index) => {
          // if first key is an locale, skip it
          if (index === 0 && locales && locales.some(locale => locale === key)) {
            return previous;
          }
          return previous && previous[key];
        }, comments);
        if (comment) {
          node.comment = comment;
        }
      }
    };
    addComments(doc.contents, []);
    return doc.toString();
  }
}
