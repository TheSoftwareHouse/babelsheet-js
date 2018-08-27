import { OAuth2Client } from 'google-auth-library';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import { ILogger } from 'node-common';
import opn = require('opn');
import * as querystring from 'querystring';
import destroyer = require('server-destroy');
import * as url from 'url';
import * as ramda from 'ramda';
import TokenProvider from '../token-provider/token-provider';

export default class GoogleAuth {
  constructor(private logger: ILogger, private port: number, private tokenProvider: TokenProvider) {}

  public async getTokens(oAuth2Client: OAuth2Client): Promise<Credentials> {
    return new Promise<Credentials>((resolve, reject) => {
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
      });

      this.logger.info(`Creating local server`);

      const server = http
        .createServer(async (req: IncomingMessage, res: ServerResponse) => {
          const requestUrl = req.url || '';

          if (requestUrl.indexOf('/oauth2callback') > -1) {
            const parsedUrl = url.parse(requestUrl).query || '';
            const parsedQueryString = querystring.parse(parsedUrl);
            const code = (parsedQueryString.code || '').toString();

            this.logger.info(`Received code ${code}`);

            res.end('Authentication successful! Please return to the console.');
            server.destroy();

            const tokenResponse = await oAuth2Client.getToken(code);

            if (!tokenResponse.tokens.refresh_token) {
              throw new Error('Problem with acquiring tokens.');
            }

            this.logger.info('Tokens acquired.');

            resolve(ramda.pick(['access_token', 'refresh_token'], tokenResponse.tokens));
          }
        })
        .listen(this.port, () => {
          opn(authorizeUrl);
        });

      destroyer(server);
    });
  }

  public createOAuthClient(clientId: string, clientSecret: string, redirectUri: string) {
    return new OAuth2Client(clientId, clientSecret, redirectUri);
  }

  public async getAuthenticatedClient({
    clientId,
    clientSecret,
    redirectUri,
  }: {
    [key: string]: string;
  }): Promise<OAuth2Client> {
    const oAuth2Client = this.createOAuthClient(clientId, clientSecret, redirectUri);
    const refreshToken = await this.tokenProvider.getToken();

    if (refreshToken) {
      this.logger.info('Using token from storage.');
      oAuth2Client.setCredentials({ refresh_token: refreshToken });

      const accessToken = await oAuth2Client.getAccessToken();

      oAuth2Client.setCredentials({
        refresh_token: refreshToken,
        access_token: accessToken.token,
      });
      return oAuth2Client;
    }

    const tokens = await this.getTokens(oAuth2Client);
    this.tokenProvider.setToken(tokens.refresh_token as string);
    this.logger.info('Token is stored.');

    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
  }
}
