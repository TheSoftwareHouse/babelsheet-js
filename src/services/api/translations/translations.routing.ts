import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import * as express from 'express';
import TranslationsController from './translations.controller';

export default class TranslationsRouting {
  private routing: Router;

  constructor(private translationsController: TranslationsController) {
    this.routing = express.Router();

    this.routing.get(
      '/',
      celebrate({
        query: {
          filters: Joi.array().items(Joi.string()),
          format: Joi.string().default('json'),
          version: Joi.string(),
        },
      }),
      this.translationsController.getTranslations
    );
  }

  public getRouting() {
    return this.routing;
  }
}
