import { Router } from 'express';
import TranslationsController from './translations.controller';
export default class TranslationsRouting {
    private translationsController;
    private routing;
    constructor(translationsController: TranslationsController);
    getRouting(): Router;
}
