"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix = require("awilix");
const tsh_node_common_1 = require("tsh-node-common");
const file_repository_1 = require("../../infrastructure/repository/file.repository");
const in_env_1 = require("../../infrastructure/storage/in-env");
const in_file_1 = require("../../infrastructure/storage/in-file");
const in_redis_1 = require("../../infrastructure/storage/in-redis");
const auth_1 = require("../../shared/google/auth");
const mask_converter_1 = require("../../shared/mask/mask.converter");
const mask_input_1 = require("../../shared/mask/mask.input");
const google_sheets_provider_1 = require("../../shared/sheets-provider/google-sheets.provider");
const in_file_sheets_provider_1 = require("../../shared/sheets-provider/in-file-sheets.provider");
const sheets_provider_factory_1 = require("../../shared/sheets-provider/sheets-provider.factory");
const token_provider_1 = require("../../shared/token-provider/token-provider");
const json_to_json_masked_transformer_1 = require("../../shared/transformers/json-to-json-masked.transformer");
const spreadsheet_to_json_transformer_1 = require("../../shared/transformers/spreadsheet-to-json.transformer");
const masked_translations_1 = require("../../shared/translations/masked-translations");
const config_provider_factory_1 = require("../cli/spreadsheet-config-providers/config-provider.factory");
const google_spreadsheet_config_provider_1 = require("../cli/spreadsheet-config-providers/google-spreadsheet-config.provider");
const in_file_spreadsheet_config_provider_1 = require("../cli/spreadsheet-config-providers/in-file-spreadsheet-config.provider");
const translations_producer_1 = require("./translations-producer/translations-producer");
function createContainer(options) {
    const container = awilix.createContainer({
        injectionMode: awilix.InjectionMode.CLASSIC,
        ...options,
    });
    const tokenProviders = {
        inEnvStorage: awilix.asClass(in_env_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        inFileStorage: awilix.asClass(in_file_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        inRedisStorage: awilix.asClass(in_redis_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        tokenProvider: awilix.asClass(token_provider_1.default).inject(() => ({
            writeProvider: container.resolve('inEnvStorage'),
            readProviders: [
                container.resolve('inEnvStorage'),
                container.resolve('inFileStorage'),
                container.resolve('inRedisStorage'),
            ],
        })),
    };
    const spreadsheetConfigProviderRegistry = {
        inFileSpreadsheetConfigProvider: awilix.asClass(in_file_spreadsheet_config_provider_1.InFileSpreadsheetConfigService),
        googleSpreadsheetConfigProvider: awilix.asClass(google_spreadsheet_config_provider_1.GoogleSpreadsheetConfigService),
        configProviderFactory: awilix.asClass(config_provider_factory_1.ConfigProviderFactory).inject(() => ({
            providers: [
                container.resolve('inFileSpreadsheetConfigProvider'),
                container.resolve('googleSpreadsheetConfigProvider'),
            ],
        })),
    };
    const spreadsheetProviderRegistry = {
        inFileSpreadsheetProvider: awilix.asClass(in_file_sheets_provider_1.default),
        googleSpreadsheetProvider: awilix.asClass(google_sheets_provider_1.default),
        sheetsProviderFactory: awilix.asClass(sheets_provider_factory_1.SheetsProviderFactory).inject(() => ({
            providers: [
                container.resolve('inFileSpreadsheetProvider'),
                container.resolve('googleSpreadsheetProvider'),
            ],
        })),
    };
    container.register({
        fileRepository: awilix.asClass(file_repository_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        googleAuth: awilix.asClass(auth_1.default),
        googleSheets: awilix.asClass(google_sheets_provider_1.default),
        logger: awilix.asValue(tsh_node_common_1.winstonLogger),
        maskConverter: awilix.asClass(mask_converter_1.default),
        maskInput: awilix.asClass(mask_input_1.default),
        port: awilix.asValue(process.env.BABELSHEET_PORT || 3000),
        storage: awilix.asClass(in_redis_1.default),
        transformer: awilix.asClass(spreadsheet_to_json_transformer_1.default),
        jsonToJsonMaskedTransformer: awilix.asClass(json_to_json_masked_transformer_1.default),
        translationsStorage: awilix.asClass(masked_translations_1.default),
        translationsProducer: awilix.asClass(translations_producer_1.default),
        ...tokenProviders,
        ...spreadsheetConfigProviderRegistry,
        ...spreadsheetProviderRegistry,
    });
    return container;
}
exports.default = createContainer;
