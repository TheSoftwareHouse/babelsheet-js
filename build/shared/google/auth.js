"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const http = require("http");
const opn = require("opn");
const querystring = require("querystring");
const ramda = require("ramda");
const destroyer = require("server-destroy");
const url = require("url");
class GoogleAuth {
    constructor(logger, port, tokenProvider) {
        this.logger = logger;
        this.port = port;
        this.tokenProvider = tokenProvider;
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
    createOAuthClient(clientId, clientSecret, redirectUri) {
        return new google_auth_library_1.OAuth2Client(clientId, clientSecret, redirectUri);
    }
    async getAuthenticatedClient({ clientId, clientSecret, redirectUri, }) {
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
        this.tokenProvider.setToken(tokens.refresh_token);
        this.logger.info('Token is stored.');
        oAuth2Client.setCredentials(tokens);
        return oAuth2Client;
    }
}
exports.default = GoogleAuth;
