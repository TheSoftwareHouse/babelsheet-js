import IStorage from '../../infrastructure/storage/storage';
import { ITokenProvider } from './token-provider.types';
export default class TokenProvider implements ITokenProvider {
    private writeProvider;
    private readProviders;
    private currentReadProvider;
    constructor(writeProvider: IStorage, readProviders: IStorage[]);
    setToken(value: string): Promise<void>;
    getToken(): Promise<any>;
}
