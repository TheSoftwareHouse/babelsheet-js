"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatToExtensions_1 = require("../../../shared/formatToExtensions");
class TranslationsController {
    constructor(translationsStorage) {
        this.translationsStorage = translationsStorage;
        this.getTranslations = this.getTranslations.bind(this);
    }
    async getTranslations(req, res, next) {
        const queryFilters = req.query.filters || [];
        return this.translationsStorage
            .getTranslations(queryFilters, req.query.format)
            .then(trans => {
            const docType = formatToExtensions_1.getDocumentType(req.query.format);
            res
                .status(200)
                .type(docType)
                .send(trans);
        })
            .catch(next);
    }
}
exports.default = TranslationsController;
