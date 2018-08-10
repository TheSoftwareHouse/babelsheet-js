"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
class NotFoundError extends app_1.default {
    constructor(message) {
        super(message, 404);
        this.message = message;
    }
}
exports.default = NotFoundError;
