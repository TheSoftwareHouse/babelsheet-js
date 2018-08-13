import { NextFunction, Request, Response } from 'express';
import TranslationsStorage from '../../../shared/translations/translations';
export default class TranslationsController {
    private translationsStorage;
    constructor(translationsStorage: TranslationsStorage);
    getTranslations(req: Request, res: Response, next: NextFunction): Promise<void>;
}
