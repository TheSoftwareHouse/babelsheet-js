"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loggerMock = {
    info: () => null,
    error: () => null,
    log: () => null,
    warn: () => null,
    verbose: () => null,
    debug: () => null,
};
exports.getLoggerMock = () => loggerMock;
