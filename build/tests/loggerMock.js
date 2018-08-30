"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loggerMock = {
    info: () => null,
    error: () => null,
};
exports.getLoggerMock = () => loggerMock;
