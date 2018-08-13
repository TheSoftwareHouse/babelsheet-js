"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app_1 = require("../../../shared/error/app");
class Server {
    constructor(translationsRouting, errorHandler, logger) {
        this.app = express();
        this.app.use(helmet());
        this.app.use(morgan(process.env.NODE_ENV === 'dev' ? 'dev' : 'combined'));
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use('/translations', translationsRouting.getRouting());
        this.app.use((req, res, next) => {
            next(new app_1.default('Not found', 404));
        });
        this.app.use(celebrate_1.errors());
        this.app.use(errorHandler.handle);
        logger.info('Created server');
    }
    getApp() {
        return this.app;
    }
}
exports.default = Server;
