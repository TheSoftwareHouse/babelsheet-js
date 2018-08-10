"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TranslationsController {
    constructor(translationsStorage) {
        this.translationsStorage = translationsStorage;
        this.getTranslations = this.getTranslations.bind(this);
    }
    async getTranslations(req, res, next) {
        const queryFilters = req.query.filters || [];
        return this.translationsStorage
            .getTranslations(queryFilters)
            .then(trans => {
            res.status(200).json(trans);
        })
            .catch(next);
    }
}
exports.default = TranslationsController;
