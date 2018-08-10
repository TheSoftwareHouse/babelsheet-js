"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix = require("awilix");
const node_common_1 = require("node-common");
const in_env_1 = require("../../infrastructure/storage/in-env");
const in_redis_1 = require("../../infrastructure/storage/in-redis");
const auth_1 = require("../../shared/google/auth");
const sheets_1 = require("../../shared/google/sheets");
const mask_converter_1 = require("../../shared/mask/mask.converter");
const mask_input_1 = require("../../shared/mask/mask.input");
const token_1 = require("../../shared/token/token");
const spreadsheet_to_json_transformer_1 = require("../../shared/transformers/spreadsheet-to-json.transformer");
const masked_translations_1 = require("../../shared/translations/masked-translations");
function createContainer(options) {
    const container = awilix.createContainer({
        injectionMode: awilix.InjectionMode.CLASSIC,
        ...options,
    });
    container.register({
        googleAuth: awilix.asClass(auth_1.default),
        googleSheets: awilix.asClass(sheets_1.default),
        inEnvStorage: awilix.asClass(in_env_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        logger: awilix.asValue(node_common_1.winstonLogger),
        maskConverter: awilix.asClass(mask_converter_1.default),
        maskInput: awilix.asClass(mask_input_1.default),
        port: awilix.asValue(process.env.PORT || 3000),
        storage: awilix.asClass(in_redis_1.default),
        tokenStorage: awilix
            .asClass(token_1.default)
            .inject(() => ({ storage: container.resolve('inEnvStorage') })),
        transformer: awilix.asClass(spreadsheet_to_json_transformer_1.default),
        translationsStorage: awilix.asClass(masked_translations_1.default),
    });
    return container;
}
exports.default = createContainer;
