export default interface ITransformer {
  supports(type: string): boolean;
  transform(
    source: { [key: string]: string[] } | Array<{ [key: string]: string }> | { [key: string]: object },
    langCode?: string,
    mergeLanguages?: boolean,
    filters?: string[],
  ): any;
}
