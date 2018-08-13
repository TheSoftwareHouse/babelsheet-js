import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import IStorage from '../../infrastructure/storage/storage';
export default class TokenStorage {
    private storage;
    constructor(storage: IStorage);
    setToken(token: Credentials): Promise<void>;
    getToken(): Promise<Credentials>;
}
