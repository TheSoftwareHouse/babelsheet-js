import { Application, NextFunction, Request, Response, Router } from "express";
import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import HttpError from "../shared/error/http";
import { errorHandler } from "../shared/error/handler";
import TranslationsStorage from "../shared/translations";

export default class Server {
  private app: Application;
  private translationsStorage: TranslationsStorage;

  helloWorld(req: Request, res: Response, next: NextFunction): void {
    res.json({ hello: "world" });
  }

  async sheet(req: Request, res: Response, next: NextFunction) {
    res.json({ sheet: "data" });
  }

  constructor(opts: any) {
    this.helloWorld = this.helloWorld.bind(this);
    this.sheet = this.sheet.bind(this);

    this.translationsStorage = opts.translationsStorage;

    const router: Router = express.Router();
    router.get("/", this.helloWorld);
    router.get("/sheet", this.sheet);

    this.app = express();
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use("/api", router);

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new HttpError("Not found", 404));
    });

    this.app.use(errorHandler);

    opts.logger.info("Created server");
  }

  getApp() {
    return this.app;
  }
}
