import { Application } from 'express';
import { ILogger } from 'tsh-node-common';
import ErrorHandler from '../../../shared/error/handler';
import TranslationsRouting from '../translations/translations.routing';
export default class Server {
    private app;
    constructor(translationsRouting: TranslationsRouting, errorHandler: ErrorHandler, logger: ILogger);
    getApp(): Application;
}
