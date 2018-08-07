export default interface ITransformer {
  supports(type: string): boolean;
  transform(source: { [key: string]: string[] }): any;
}
