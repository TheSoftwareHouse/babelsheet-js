"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler {
    constructor(logger) {
        this.logger = logger;
        this.handle = this.handle.bind(this);
    }
    handle(err, req, res, next) {
        const status = err.status || 500;
        this.logger.error(JSON.stringify({
            message: err.message,
            stack: err.stack,
            status,
        }));
        res.status(err.status || 500).json({
            message: err.message,
            status,
        });
    }
}
exports.default = ErrorHandler;
