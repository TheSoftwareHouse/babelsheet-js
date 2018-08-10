"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const await_to_js_1 = require("await-to-js");
const dotenv = require("dotenv");
const schedule = require("node-schedule");
const ramda = require("ramda");
const container_1 = require("./container");
dotenv.config();
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
    const spreadsheetData = await container.resolve('googleSheets').fetchSpreadsheet();
    const transformedData = await container.resolve('transformer').transform(spreadsheetData);
    const [, actualTranslations] = await await_to_js_1.default(container.resolve('translationsStorage').getTranslations([]));
    if (!ramda.equals(transformedData, actualTranslations)) {
        await container.resolve('translationsStorage').clearTranslations();
        await container.resolve('translationsStorage').setTranslations([], transformedData);
        container.resolve('logger').info('Translations were refreshed');
    }
}
const everyFiveMinutes = '*/5 * * * *';
schedule.scheduleJob(everyFiveMinutes, () => {
    main();
});
