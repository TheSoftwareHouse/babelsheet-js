#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const BABELSHEET_ENV_PATH = '.env.babelsheet';
dotenv.config();
dotenv.config({ path: BABELSHEET_ENV_PATH });
const schedule = require("node-schedule");
const checkAuthParams_1 = require("../../shared/checkAuthParams");
const container_1 = require("./container");
const container = container_1.default();
process.on('uncaughtException', err => {
    container.resolve('logger').error(err.toString());
    process.exit(1);
});
process.on('unhandledRejection', err => {
    container.resolve('logger').error(err.toString());
    process.exit(1);
});
function getAuthDataFromEnv() {
    const { BABELSHEET_CLIENT_ID, BABELSHEET_CLIENT_SECRET, BABELSHEET_SPREADSHEET_ID, BABELSHEET_SPREADSHEET_NAME, BABELSHEET_REDIRECT_URI, } = process.env;
    const authData = {
        clientId: BABELSHEET_CLIENT_ID,
        clientSecret: BABELSHEET_CLIENT_SECRET,
        spreadsheetId: BABELSHEET_SPREADSHEET_ID,
        spreadsheetName: BABELSHEET_SPREADSHEET_NAME || 'Sheet1',
        redirectUri: BABELSHEET_REDIRECT_URI || 'http://localhost:3000/oauth2callback',
    };
    checkAuthParams_1.checkAuthParameters(authData);
    return authData;
}
async function main() {
    const authData = getAuthDataFromEnv();
    await container.resolve('translationsProducer').produce(authData);
}
const everyFiveMinutes = '*/5 * * * *';
main();
schedule.scheduleJob(everyFiveMinutes, () => {
    main();
});
