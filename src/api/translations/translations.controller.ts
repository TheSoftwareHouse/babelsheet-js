import { NextFunction, Request, Response } from "express";
import TranslationsStorage from "../../shared/translations/translations";

export default class TranslationsController {
  private translationsStorage: TranslationsStorage;

  constructor(opts: any) {
    this.getTranslations = this.getTranslations.bind(this);

    this.translationsStorage = opts.translationsStorage;
  }

  public async getTranslations(req: Request, res: Response, next: NextFunction) {
    const trans = await this.translationsStorage.getTranslations();

    return res.status(200).json(trans);
  }
}
