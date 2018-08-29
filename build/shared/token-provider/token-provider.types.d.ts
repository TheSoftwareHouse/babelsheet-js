export interface ITokenProvider {
    setRefreshToken(key: string, value: string): Promise<void>;
    getRefreshToken(key: string): Promise<any>;
}
