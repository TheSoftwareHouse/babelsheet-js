"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const express = require("express");
class TranslationsRouting {
    constructor(translationsController) {
        this.translationsController = translationsController;
        this.routing = express.Router();
        this.routing.get('/', celebrate_1.celebrate({
            query: {
                comments: celebrate_1.Joi.boolean().default(false),
                filters: celebrate_1.Joi.array()
                    .items(celebrate_1.Joi.string())
                    .when('format', {
                    is: "po",
                    then: celebrate_1.Joi.array().required().min(1).error(() => {
                        return "for the PO format you need to provide at least one filter";
                    })
                }),
                format: celebrate_1.Joi.string().default('json'),
                version: celebrate_1.Joi.string(),
                keepLocale: celebrate_1.Joi.boolean()
                    .default(false)
                    .when('format', {
                    is: "po",
                    then: celebrate_1.Joi.only(true).default(true).error(() => {
                        return "you have to preserve the locales in PO files";
                    })
                }),
            },
        }), this.translationsController.getTranslations);
    }
    getRouting() {
        return this.routing;
    }
}
exports.default = TranslationsRouting;
