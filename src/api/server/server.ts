import { errors } from "celebrate";
import * as cors from "cors";
import { Application, NextFunction, Request, Response } from "express";
import * as express from "express";
import * as morgan from "morgan";
import AppError from "../../shared/error/app";

export default class Server {
  private app: Application;

  constructor(opts: any) {
    this.app = express();

    this.app.use(morgan(process.env.NODE_ENV === "dev" ? "dev" : "combined"));

    this.app.use(express.json());

    this.app.use(cors());

    this.app.use("/translations", opts.translationsRouting.getRouting());

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new AppError("Not found", 404));
    });

    this.app.use(errors());

    this.app.use(opts.errorHandler.handle);

    opts.logger.info("Created server");
  }

  public getApp() {
    return this.app;
  }
}
