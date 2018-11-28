"use strict";
import SpreadsheetToJsonTransformer from "../../../src/shared/transformers/spreadsheet-to-json.transformer";
import JsonToJsonMaskedTransformer from "../../../src/shared/transformers/json-to-json-masked.transformer";
import JsonToFlatListTransformer from "../../../src/shared/transformers/json-to-flat-list.transformer";
import FlatListToPoTransformer from "../../../src/shared/transformers/flat-list-to-po.transformer";

Object.defineProperty(exports, "__esModule", { value: true });
const awilix = require("awilix");
const tsh_node_common_1 = require("tsh-node-common");
const file_repository_1 = require("../../infrastructure/repository/file.repository");
const in_env_1 = require("../../infrastructure/storage/in-env");
const in_file_1 = require("../../infrastructure/storage/in-file");
const auth_1 = require("../../shared/google/auth");
const mask_converter_1 = require("../../shared/mask/mask.converter");
const mask_input_1 = require("../../shared/mask/mask.input");
const google_sheets_provider_1 = require("../../shared/sheets-provider/google-sheets.provider");
const in_file_sheets_provider_1 = require("../../shared/sheets-provider/in-file-sheets.provider");
const token_provider_1 = require("../../shared/token-provider/token-provider");
const chain_transformer_1 = require("../../shared/transformers/chain.transformer");
const flat_list_to_ios_strings_transformer_1 = require("../../shared/transformers/flat-list-to-ios-strings.transformer");
const flat_list_to_xlf_transformer_1 = require("../../shared/transformers/flat-list-to-xlf.transformer");
const flat_list_to_po_transformer_1 = require("../../shared/transformers/flat-list-to-po.transformer");
const flat_list_to_xml_transformer_1 = require("../../shared/transformers/flat-list-to-xml.transformer");
const json_to_flat_list_transformer_1 = require("../../shared/transformers/json-to-flat-list.transformer");
const json_to_json_masked_transformer_1 = require("../../shared/transformers/json-to-json-masked.transformer");
const json_to_yaml_transformer_1 = require("../../shared/transformers/json-to-yaml.transformer");
const spreadsheet_to_json_string_transformer_1 = require("../../shared/transformers/spreadsheet-to-json-string.transformer");
const spreadsheet_to_json_transformer_1 = require("../../shared/transformers/spreadsheet-to-json.transformer");
const transformers_1 = require("../../shared/transformers/transformers");
const sheets_provider_factory_1 = require("./../../shared/sheets-provider/sheets-provider.factory");
const android_files_creator_1 = require("./files-creators/android-files.creator");
const files_creators_1 = require("./files-creators/files-creators");
const ios_files_creator_1 = require("./files-creators/ios-files.creator");
const json_files_creator_1 = require("./files-creators/json-files.creator");
const xlf_files_creator_1 = require("./files-creators/xlf-files.creator");
const yaml_files_creator_1 = require("./files-creators/yaml-files.creator");
const po_files_creator_1 = require("./files-creators/po-files.creator");
const interpreter_1 = require("./interpreter/interpreter");
const config_provider_factory_1 = require("./spreadsheet-config-providers/config-provider.factory");
const google_spreadsheet_config_provider_1 = require("./spreadsheet-config-providers/google-spreadsheet-config.provider");
const in_file_spreadsheet_config_provider_1 = require("./spreadsheet-config-providers/in-file-spreadsheet-config.provider");
function createContainer(options) {
    const container = awilix.createContainer({
        injectionMode: awilix.InjectionMode.CLASSIC,
        ...options,
    });
    const maskProviders = {
        maskConverter: awilix.asClass(mask_converter_1.default),
        maskInput: awilix.asClass(mask_input_1.default),
    };
    const tokenProviders = {
        inEnvStorage: awilix.asClass(in_env_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        inFileStorage: awilix.asClass(in_file_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        tokenProvider: awilix.asClass(token_provider_1.default).inject(() => ({
            writeProvider: container.resolve('inEnvStorage'),
            readProviders: [
                container.resolve('inEnvStorage'),
                container.resolve('inFileStorage'),
            ],
        })),
    };
    const fileCreatorsRegistry = {
        androidFilesCreator: awilix.asClass(android_files_creator_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            fileRepository: container.resolve('fileRepository'),
        })),
        iosFilesCreator: awilix.asClass(ios_files_creator_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            fileRepository: container.resolve('fileRepository'),
        })),
        jsonFilesCreator: awilix.asClass(json_files_creator_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            fileRepository: container.resolve('fileRepository'),
        })),
        xlfFilesCreator: awilix.asClass(xlf_files_creator_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            fileRepository: container.resolve('fileRepository'),
        })),
        yamlFilesCreator: awilix.asClass(yaml_files_creator_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            fileRepository: container.resolve('fileRepository'),
        })),
        poFilesCreator: awilix.asClass(po_files_creator_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            fileRepository: container.resolve('fileRepository'),
        })),
        filesCreators: awilix.asClass(files_creators_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            filesCreators: [
                container.resolve('androidFilesCreator'),
                container.resolve('iosFilesCreator'),
                container.resolve('jsonFilesCreator'),
                container.resolve('xlfFilesCreator'),
                container.resolve('yamlFilesCreator'),
                container.resolve('poFilesCreator'),
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
    const transformersRegistry = {
        jsonToJsonMaskedTransformer: awilix.asClass(json_to_json_masked_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        flatListToIosStringsTransformer: awilix.asClass(flat_list_to_ios_strings_transformer_1.default, {
            lifetime: awilix.Lifetime.SINGLETON,
        }),
        flatListToXlfTransformer: awilix.asClass(flat_list_to_xlf_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        flatListToPoTransformer: awilix.asClass(flat_list_to_po_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        flatListToXmlTransformer: awilix.asClass(flat_list_to_xml_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        jsonToFlatListTransformer: awilix.asClass(json_to_flat_list_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        jsonToYamlTransformer: awilix.asClass(json_to_yaml_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        spreadsheetToJsonTransformer: awilix.asClass(spreadsheet_to_json_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        spreadsheetToIosStringsTransformer: awilix
            .asClass(chain_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON })
            .inject(() => ({
            supportedType: 'strings',
            transformers: [
                container.resolve('spreadsheetToJsonTransformer'),
                container.resolve('jsonToJsonMaskedTransformer'),
                container.resolve('jsonToFlatListTransformer'),
                container.resolve('flatListToIosStringsTransformer'),
            ],
        })),
        spreadsheetToJsonStringTransformer: awilix
            .asClass(spreadsheet_to_json_string_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON })
            .inject(() => ({
            spreadsheetToJson: container.resolve('spreadsheetToJsonTransformer'),
            jsonToJsonMasked: container.resolve('jsonToJsonMaskedTransformer'),
        })),
        spreadsheetToXlfTransformer: awilix
            .asClass(chain_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON })
            .inject(() => ({
            supportedType: 'xlf',
            transformers: [
                container.resolve('spreadsheetToJsonTransformer'),
                container.resolve('jsonToJsonMaskedTransformer'),
                container.resolve('jsonToFlatListTransformer'),
                container.resolve('flatListToXlfTransformer'),
            ],
        })),
        spreadsheetToXmlTransformer: awilix
            .asClass(chain_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON })
            .inject(() => ({
            supportedType: 'xml',
            transformers: [
                container.resolve('spreadsheetToJsonTransformer'),
                container.resolve('jsonToJsonMaskedTransformer'),
                container.resolve('jsonToFlatListTransformer'),
                container.resolve('flatListToXmlTransformer'),
            ],
        })),
        spreadsheetToYamlTransformer: awilix
            .asClass(chain_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON })
            .inject(() => ({
            supportedType: 'yml',
            transformers: [
                container.resolve('spreadsheetToJsonTransformer'),
                container.resolve('jsonToJsonMaskedTransformer'),
                container.resolve('jsonToYamlTransformer'),
            ],
        })),
        spreadsheetToPoTransformer: awilix
            .asClass(chain_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON })
            .inject(() => ({
            supportedType: 'po',
            transformers: [
                container.resolve<SpreadsheetToJsonTransformer>('spreadsheetToJsonTransformer'),
                container.resolve<JsonToJsonMaskedTransformer>('jsonToJsonMaskedTransformer'),
                container.resolve<JsonToFlatListTransformer>('jsonToFlatListTransformer'),
                container.resolve<FlatListToPoTransformer>('flatListToPoTransformer'),
            ],
        })),
        transformers: awilix.asClass(transformers_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            transformers: [
                container.resolve('spreadsheetToJsonStringTransformer'),
                container.resolve('spreadsheetToXmlTransformer'),
                container.resolve('spreadsheetToIosStringsTransformer'),
                container.resolve('spreadsheetToXlfTransformer'),
                container.resolve('spreadsheetToYamlTransformer'),
                container.resolve('spreadsheetToPoTransformer'),
            ],
        })),
    };
    container.register({
        shadowArgs: awilix.asValue(undefined),
        interpreter: awilix.asClass(interpreter_1.default),
        fileRepository: awilix.asClass(file_repository_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        googleAuth: awilix.asClass(auth_1.default),
        logger: awilix.asValue(tsh_node_common_1.winstonLogger),
        inEnvStorage: awilix.asClass(in_env_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        port: awilix.asValue(process.env.BABELSHEET_PORT || 3000),
        ...maskProviders,
        ...tokenProviders,
        ...transformersRegistry,
        ...fileCreatorsRegistry,
        ...spreadsheetConfigProviderRegistry,
        ...spreadsheetProviderRegistry,
    });
    return container;
}
exports.default = createContainer;
