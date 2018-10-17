import { NextFunction, Request, Response } from 'express';
import { getDocumentType } from '../../../shared/formatToExtensions';
import TranslationsStorage from '../../../shared/translations/translations';

export default class TranslationsController {
  constructor(private translationsStorage: TranslationsStorage) {
    this.getTranslations = this.getTranslations.bind(this);
  }

  public async getTranslations(req: Request, res: Response, next: NextFunction): Promise<void> {
    const queryFilters = req.query.filters || [];

    return this.translationsStorage
      .getTranslations(queryFilters, {
        format: req.query.format,
        keepLocale: req.query.keepLocale,
        comments: req.query.comments,
      })
      .then(trans => {
        const docType = getDocumentType(req.query.format);
        res
          .status(200)
          .type(docType)
          .send(trans.result.merged ? trans.result.merged : trans.result);
      })
      .catch(next);
  }
}
