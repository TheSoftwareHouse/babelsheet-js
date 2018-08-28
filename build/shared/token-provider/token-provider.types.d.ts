export interface ITokenProvider {
    setToken(key: string, value: string): Promise<void>;
    getToken(key: string): Promise<any>;
}
