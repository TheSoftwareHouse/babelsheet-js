export default interface ITransformer {
  transform(source: { [key: string]: string[] }): any;
  supports(type: string): boolean;
}
