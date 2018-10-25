import ITransformer, { ITranslationsData } from './transformer';

export default class FlatListToIosStringsTransformer implements ITransformer {
  private readonly supportedType = 'flat-list-strings';

  public supports(type: string): boolean {
    return type.toLowerCase() === this.supportedType;
  }

  public transform(source: ITranslationsData): ITranslationsData {
    if (source.meta.mergeLanguages) {
      return {
        ...source,
        result: {
          merged: this.generateIosStrings(source.result.merged, source.meta.includeComments),
        },
      };
    } else {
      return {
        ...source,
        result: source.result.map(({ lang, content }: { lang: any; content: any }) => ({
          lang,
          content: this.generateIosStrings(content, source.meta.includeComments),
        })),
      };
    }
  }

  private generateIosStrings(
    source: Array<{ name: string; text: string; comment?: string }>,
    includeComments?: boolean
  ): string {
    return source.reduce(
      (previous: string, element) =>
        includeComments && element.comment
          ? `${previous}/* Note = "${element.comment}"; */\n"${element.name}" = "${element.text || ''}";\n`
          : `${previous}"${element.name}" = "${element.text || ''}";\n`,
      ''
    );
  }
}
