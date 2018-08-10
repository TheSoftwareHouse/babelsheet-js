import { OAuth2Client } from 'google-auth-library';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import { ILogger } from 'node-common';
import TokenStorage from '../token/token';
export default class GoogleAuth {
    private logger;
    private port;
    private tokenStorage;
    constructor(logger: ILogger, port: number, tokenStorage: TokenStorage);
    getTokens(oAuth2Client: OAuth2Client): Promise<Credentials>;
    getOAuth2Client(): OAuth2Client;
    getAuthenticatedClient(): Promise<OAuth2Client>;
}
