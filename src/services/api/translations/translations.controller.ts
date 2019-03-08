import { NextFunction, Request, Response } from 'express';
import { getDocumentType } from '../../../shared/formatToExtensions';
import TranslationsStorage from '../../../shared/translations/translations';

export default class TranslationsController {
  constructor(private translationsStorage: TranslationsStorage) {
    this.getTranslations = this.getTranslations.bind(this);
  }

  public async getTranslations(req: Request, res: Response, next: NextFunction): Promise<void> {
    const queryFilters = req.query.filters || [];

    const version = req.query.version || process.env.BABELSHEET_SPREADSHEET_NAME || 'Sheet1';

    return this.translationsStorage
      .getTranslations(queryFilters, req.query.format, version)
      .then(trans => {
        const docType = getDocumentType(req.query.format);
        res
          .status(200)
          .type(docType)
          .send(trans);
      })
      .catch(next);
  }
}
