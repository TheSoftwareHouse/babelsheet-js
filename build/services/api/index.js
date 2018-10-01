#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const BABELSHEET_ENV_PATH = '.env.babelsheet';
dotenv.config();
dotenv.config({ path: BABELSHEET_ENV_PATH });
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
const server = container.resolve('server').getApp();
server.listen(container.resolve('port'));
