import { NextFunction, Request, Response } from 'express';
import { ILogger } from 'node-common';

export default class ErrorHandler {
  constructor(private logger: ILogger) {
    this.handle = this.handle.bind(this);
  }

  public handle(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err.status || 500;

    this.logger.error(
      JSON.stringify({
        message: err.message,
        stack: err.stack,
        status,
      })
    );

    res.status(err.status || 500).json({
      message: err.message,
      status,
    });
  }
}
