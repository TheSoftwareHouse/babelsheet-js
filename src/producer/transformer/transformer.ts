export default interface ITransformer {
  transform(source: { [key: string]: string[] }): object;
};
