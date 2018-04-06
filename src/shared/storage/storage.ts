export default interface IStorage {
  set(key: string, value: any): void;
  get(key: string): any;
};
