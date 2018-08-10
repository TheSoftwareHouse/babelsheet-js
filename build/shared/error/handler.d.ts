import { NextFunction, Request, Response } from 'express';
import { ILogger } from 'node-common';
export default class ErrorHandler {
    private logger;
    constructor(logger: ILogger);
    handle(err: any, req: Request, res: Response, next: NextFunction): void;
}
