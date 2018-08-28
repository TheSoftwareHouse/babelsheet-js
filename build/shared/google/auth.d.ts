import { OAuth2Client } from 'google-auth-library';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import { ILogger } from 'tsh-node-common';
import TokenProvider from '../token-provider/token-provider';
export default class GoogleAuth {
    private logger;
    private port;
    private tokenProvider;
    constructor(logger: ILogger, port: number, tokenProvider: TokenProvider);
    getTokens(oAuth2Client: OAuth2Client): Promise<Credentials>;
    createOAuthClient(clientId: string, clientSecret: string, redirectUri: string): OAuth2Client;
    getAuthenticatedClient({ clientId, clientSecret, redirectUri, }: {
        [key: string]: string;
    }): Promise<OAuth2Client>;
}
