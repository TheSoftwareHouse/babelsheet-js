"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.message = message;
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
        this.status = status || 500;
    }
}
exports.default = AppError;
