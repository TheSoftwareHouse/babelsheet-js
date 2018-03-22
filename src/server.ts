import { Application, NextFunction, Request, Response, Router } from "express";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as cors from "cors";

export default class Server {
  private app: Application;

  helloWorld(req: Request, res: Response, next: NextFunction): void {
    res.send({ hello: "world" });
  }

  constructor(opts: any) {
    const router: Router = express.Router();
    router.get("/", this.helloWorld);

    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use("/api", router);

    opts.logger.info("Created server");
  }

  getApp() {
    return this.app;
  }
}
