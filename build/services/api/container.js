"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix = require("awilix");
const node_common_1 = require("node-common");
const in_redis_1 = require("../../infrastructure/storage/in-redis");
const handler_1 = require("../../shared/error/handler");
const mask_converter_1 = require("../../shared/mask/mask.converter");
const mask_input_1 = require("../../shared/mask/mask.input");
const cached_translations_1 = require("../../shared/translations/cached-translations");
const masked_translations_1 = require("../../shared/translations/masked-translations");
const translations_key_generator_1 = require("../../shared/translations/translations.key-generator");
const server_1 = require("./server/server");
const translations_controller_1 = require("./translations/translations.controller");
const translations_routing_1 = require("./translations/translations.routing");
function createContainer(options) {
    const container = awilix.createContainer({
        injectionMode: awilix.InjectionMode.CLASSIC,
        ...options,
    });
    container.register({
        errorHandler: awilix.asClass(handler_1.default),
        logger: awilix.asValue(node_common_1.winstonLogger),
        maskConverter: awilix.asClass(mask_converter_1.default),
        maskInput: awilix.asClass(mask_input_1.default),
        maskedTranslations: awilix.asClass(masked_translations_1.default),
        port: awilix.asValue(process.env.PORT || 3000),
        server: awilix.asClass(server_1.default),
        storage: awilix.asClass(in_redis_1.default),
        translationsController: awilix.asClass(translations_controller_1.default),
        translationsKeyGenerator: awilix.asClass(translations_key_generator_1.default),
        translationsRouting: awilix.asClass(translations_routing_1.default),
        translationsStorage: awilix.asClass(cached_translations_1.default),
    });
    return container;
}
exports.default = createContainer;
