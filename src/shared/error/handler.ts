import { NextFunction, Request, Response } from "express";
import { LoggerInstance } from "winston";

export default class ErrorHandler {
  private logger: LoggerInstance;

  constructor(opts: any) {
    this.handle = this.handle.bind(this);

    this.logger = opts.logger;
  }

  public handle(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err.status || 500;

    this.logger.error(
      JSON.stringify({
        message: err.message,
        stack: err.stack,
        status
      })
    );

    res.status(err.status || 500).json({
      message: err.message,
      status
    });
  }
}
