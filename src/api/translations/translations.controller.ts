import { NextFunction, Request, Response } from 'express';
import TranslationsStorage from '../../shared/translations/translations';

export default class TranslationsController {
  constructor(private translationsStorage: TranslationsStorage) {
    this.getTranslations = this.getTranslations.bind(this);
  }

  public async getTranslations(req: Request, res: Response, next: NextFunction) {
    const queryFilters = req.query.filters || [];

    return this.translationsStorage
      .getTranslations(queryFilters)
      .then(trans => res.status(200).json(trans))
      .catch(next);
  }
}
