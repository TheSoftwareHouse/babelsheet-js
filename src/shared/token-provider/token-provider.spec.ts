export interface ITokenProvider {
  setToken(key: string, value: string): void;
  getToken(key: string): Promise<any>;
}
