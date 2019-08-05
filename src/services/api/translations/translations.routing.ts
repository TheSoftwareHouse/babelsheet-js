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
          filters: Joi.array()
            .items(Joi.string())
            .when('format', {
              is: 'po',
              then: Joi.array()
                .required()
                .min(1)
                .error(() => {
                  return 'for the PO format you need to provide at least one filter';
                }),
            }),
          format: Joi.string().default('json'),
          version: Joi.string(),
          keepLocale: Joi.boolean()
            .default(false)
            .when('format', {
              is: 'po',
              then: Joi.only(true)
                .default(true)
                .error(() => {
                  return 'you have to preserve the locales in PO files';
                }),
            }),
        },
      }),
      this.translationsController.getTranslations
    );
  }

  public getRouting() {
    return this.routing;
  }
}
