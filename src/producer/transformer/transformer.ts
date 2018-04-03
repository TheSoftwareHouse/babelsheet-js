export default interface Transformer {
  transform(source: { [key: string]: string[] }): Object;
};
