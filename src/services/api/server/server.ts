import { errors } from 'celebrate';
import * as cors from 'cors';
import { Application, NextFunction, Request, Response } from 'express';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { ILogger } from 'tsh-node-common';
import AppError from '../../../shared/error/app';
import ErrorHandler from '../../../shared/error/handler';
import TranslationsRouting from '../translations/translations.routing';

export default class Server {
  private app: Application;

  constructor(translationsRouting: TranslationsRouting, errorHandler: ErrorHandler, logger: ILogger) {
    this.app = express();

    this.app.use(helmet());

    this.app.use(morgan(process.env.NODE_ENV === 'dev' ? 'dev' : 'combined'));

    this.app.use(express.json());

    this.app.use(cors());

    this.app.use('/translations', translationsRouting.getRouting());

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new AppError('Not found', 404));
    });

    this.app.use(errors());

    this.app.use(errorHandler.handle);

    logger.info('Created server');
  }

  public getApp() {
    return this.app;
  }
}
