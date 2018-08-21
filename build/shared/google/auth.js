"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const http = require("http");
const opn = require("opn");
const querystring = require("querystring");
const destroyer = require("server-destroy");
const url = require("url");
class GoogleAuth {
    constructor(logger, port, tokenStorage) {
        this.logger = logger;
        this.port = port;
        this.tokenStorage = tokenStorage;
    }
    async getTokens(oAuth2Client) {
        return new Promise((resolve, reject) => {
            const authorizeUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
            });
            this.logger.info(`Creating local server`);
            const server = http
                .createServer(async (req, res) => {
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
    async getAuthenticatedClient({ clientId, clientSecret, redirectUri, }) {
        const redirect = redirectUri || 'http://localhost:3000/oauth2callback';
        const oAuth2Client = new google_auth_library_1.OAuth2Client(clientId, clientSecret, redirect);
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
        }
        else {
            const tokens = await this.getTokens(oAuth2Client);
            this.tokenStorage.setToken(tokens);
            this.logger.info('Token is stored.');
            oAuth2Client.setCredentials(tokens);
        }
        return oAuth2Client;
    }
}
exports.default = GoogleAuth;
