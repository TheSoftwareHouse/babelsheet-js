#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const BABELSHEET_ENV_PATH = '.env.babelsheet';
dotenv.config();
dotenv.config({ path: BABELSHEET_ENV_PATH });
const schedule = require("node-schedule");
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
async function main() {
    const spreadsheetSource = process.env.BABELSHEET_SPREADSHEET_SOURCE || 'google';
    const configProvider = container
        .resolve('configProviderFactory')
        .getProviderFor(spreadsheetSource);
    const sheetsProvider = container
        .resolve('sheetsProviderFactory')
        .getProviderFor(spreadsheetSource);
    const authData = configProvider.getSpreadsheetConfig({});
    await container.resolve('translationsProducer').produce(authData, sheetsProvider);
}
const everyFiveMinutes = '*/5 * * * *';
main();
schedule.scheduleJob(everyFiveMinutes, () => {
    main();
});
