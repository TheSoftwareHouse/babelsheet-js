export interface ITokenProvider {
  set(key: string, value: string): void;
  get(key: string): Promise<any>;
}
