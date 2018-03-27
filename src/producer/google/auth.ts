import { OAuth2Client } from "google-auth-library";
import * as http from "http";
import { IncomingMessage, ServerResponse } from "http";
import * as url from "url";
import * as querystring from "querystring";
import opn = require("opn");
import { Credentials } from "google-auth-library/build/src/auth/credentials";
import destroyer = require("server-destroy");
import TokenStorage from "../tokenStorage";

export default class GoogleAuth {
  private logger: any;
  private port: any;
  private tokenStorage: TokenStorage;

  constructor(opts: any) {
    this.logger = opts.logger;
    this.port = opts.port;
    this.tokenStorage = opts.tokenStorage;
  }

  async getTokens(oAuth2Client: OAuth2Client): Promise<Credentials> {
    return new Promise<Credentials>((resolve, reject) => {
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/spreadsheets.readonly"
      });

      this.logger.info(`Creating local server`);

      const server = http
        .createServer(async (req: IncomingMessage, res: ServerResponse) => {
          const requestUrl = req.url || "";

          if (requestUrl.indexOf("/oauth2callback") > -1) {
            const parsedUrl = url.parse(requestUrl).query || "";
            const parsedQueryString = querystring.parse(parsedUrl);
            const code = parsedQueryString.code.toString();

            this.logger.info(`Received code ${code}`);

            res.end("Authentication successful! Please return to the console.");
            server.destroy();

            const tokenResponse = await oAuth2Client.getToken(code);

            this.logger.info("Tokens acquired.");

            resolve(tokenResponse.tokens);
          }
        })
        .listen(this.port, () => {
          opn(authorizeUrl);
        });

      destroyer(server);
    });
  }

  getOAuth2Client(): OAuth2Client {
    const clientSecret = process.env.CLIENT_SECRET;
    const clientId = process.env.CLIENT_ID;
    const redirectUrl = process.env.REDIRECT_URI;

    // TODO: handle case when there are no envs

    const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

    return oAuth2Client;
  }

  async getAuthenticatedClient(): Promise<OAuth2Client> {
    const oAuth2Client = this.getOAuth2Client();

    if (this.tokenStorage.token.access_token) {
      this.logger.info("Using token from storage.");
      oAuth2Client.setCredentials(this.tokenStorage.token);

      const newToken = await oAuth2Client.getAccessToken();

      if (this.tokenStorage.token.access_token !== newToken.token) {
        this.tokenStorage.token = {
          ...this.tokenStorage.token,
          access_token: newToken.token,
          expiry_date: new Date().getTime() + 1000 * 60 * 60 * 24
        };

        this.logger.info("Storing refreshed access token.");
        oAuth2Client.setCredentials(this.tokenStorage.token);
      }
    } else {
      const token = await this.getTokens(oAuth2Client);

      this.tokenStorage.token = token;

      this.logger.info("Token is stored.");

      oAuth2Client.setCredentials(token);
    }

    return oAuth2Client;
  }
}
