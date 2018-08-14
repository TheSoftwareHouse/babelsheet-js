import { OAuth2Client } from 'google-auth-library';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';
import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import { ILogger } from 'node-common';
import opn = require('opn');
import * as querystring from 'querystring';
import destroyer = require('server-destroy');
import * as url from 'url';
import TokenStorage from '../token/token';

export default class GoogleAuth {
  constructor(private logger: ILogger, private port: number, private tokenStorage: TokenStorage) {}

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

            this.logger.info('Tokens acquired.');

            resolve(tokenResponse.tokens);
          }
        })
        .listen(this.port, () => {
          opn(authorizeUrl);
        });

      destroyer(server);
    });
  }

  public getOAuth2Client(): OAuth2Client {
    const clientSecret = process.env.CLIENT_SECRET;
    const clientId = process.env.CLIENT_ID;
    const redirectUrl = process.env.REDIRECT_URI || 'http://localhost:3000/oauth2callback';

    const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

    return oAuth2Client;
  }

  public async getAuthenticatedClient(): Promise<OAuth2Client> {
    const oAuth2Client = this.getOAuth2Client();

    const token = await this.tokenStorage.getToken();

    if (token && token.access_token) {
      this.logger.info('Using token from storage.');
      oAuth2Client.setCredentials(token);

      const newToken = await oAuth2Client.getAccessToken();

      if (token.access_token !== newToken.token) {
        await this.tokenStorage.setToken({
          ...token,
          access_token: newToken.token,
          expiry_date: new Date().getTime() + 1000 * 60 * 60 * 24,
        });

        this.logger.info('Storing refreshed access token.');
        oAuth2Client.setCredentials(await this.tokenStorage.getToken());
      }
    } else {
      const tokens = await this.getTokens(oAuth2Client);

      this.tokenStorage.setToken(tokens);

      this.logger.info('Token is stored.');

      oAuth2Client.setCredentials(tokens);
    }

    return oAuth2Client;
  }
}
