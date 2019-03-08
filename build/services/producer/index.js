#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const BABELSHEET_ENV_PATH = '.env.babelsheet';
dotenv.config();
dotenv.config({ path: BABELSHEET_ENV_PATH });
const await_to_js_1 = require("await-to-js");
const schedule = require("node-schedule");
const ramda = require("ramda");
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
        spreadsheetName: BABELSHEET_SPREADSHEET_NAME,
        redirectUri: BABELSHEET_REDIRECT_URI || 'http://localhost:3000/oauth2callback',
    };
    checkAuthParams_1.checkAuthParameters(authData);
    return authData;
}
async function main() {
    const authData = getAuthDataFromEnv();
    const spreadsheetData = await container.resolve('googleSheets').fetchSpreadsheet(authData);
    const transformer = container.resolve('transformer');
    const transformedSheets = await Object.keys(spreadsheetData).reduce(async (transformedTranslationsPromise, key) => {
        const values = spreadsheetData[key];
        if (!values) {
            return transformedTranslationsPromise;
        }
        const data = await transformer.transform(spreadsheetData[key]);
        const transformedTranslations = await transformedTranslationsPromise;
        transformedTranslations[key] = data;
        return transformedTranslationsPromise;
    }, Promise.resolve({}));
    const translationsStorage = container.resolve('translationsStorage');
    const logger = container.resolve('logger');
    Object.keys(transformedSheets).forEach(async (key) => {
        const [, actualTranslations] = await await_to_js_1.default(translationsStorage.getTranslations([], key));
        if (!ramda.equals(transformedSheets[key], actualTranslations)) {
            await translationsStorage.clearTranslations(key);
            await translationsStorage.setTranslations([], transformedSheets[key], key);
            logger.info(`Translations (version ${key}) were refreshed`);
        }
    });
}
const everyFiveMinutes = '*/5 * * * *';
main();
schedule.scheduleJob(everyFiveMinutes, () => {
    main();
});
