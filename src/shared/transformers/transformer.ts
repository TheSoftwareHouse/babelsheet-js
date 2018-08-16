export default interface ITransformer {
  supports(type: string): boolean;
  transform(
    source: { [key: string]: string[] } | Array<{ [key: string]: string }>,
    langCode?: string,
    separate?: boolean
  ): any;
}
