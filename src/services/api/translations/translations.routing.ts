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
          comments: Joi.boolean().default(false),
          filters: Joi.array().items(Joi.string()),
          format: Joi.string().default('json'),
          version: Joi.string(),
          keepLocale: Joi.boolean().default(false),
        },
      }),
      this.translationsController.getTranslations
    );
  }

  public getRouting() {
    return this.routing;
  }
}
