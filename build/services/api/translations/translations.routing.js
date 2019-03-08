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
                filters: celebrate_1.Joi.array().items(celebrate_1.Joi.string()),
                format: celebrate_1.Joi.string().default('json'),
                version: celebrate_1.Joi.string(),
            },
        }), this.translationsController.getTranslations);
    }
    getRouting() {
        return this.routing;
    }
}
exports.default = TranslationsRouting;
