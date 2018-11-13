"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix = require("awilix");
const tsh_node_common_1 = require("tsh-node-common");
const file_repository_1 = require("../../infrastructure/repository/file.repository");
const in_env_1 = require("../../infrastructure/storage/in-env");
const in_file_1 = require("../../infrastructure/storage/in-file");
const auth_1 = require("../../shared/google/auth");
const sheets_1 = require("../../shared/google/sheets");
const mask_converter_1 = require("../../shared/mask/mask.converter");
const mask_input_1 = require("../../shared/mask/mask.input");
const token_provider_1 = require("../../shared/token-provider/token-provider");
const chain_transformer_1 = require("../../shared/transformers/chain.transformer");
const flat_list_to_ios_strings_transformer_1 = require("../../shared/transformers/flat-list-to-ios-strings.transformer");
const flat_list_to_xlf_transformer_1 = require("../../shared/transformers/flat-list-to-xlf.transformer");
const flat_list_to_xml_transformer_1 = require("../../shared/transformers/flat-list-to-xml.transformer");
const json_to_flat_list_transformer_1 = require("../../shared/transformers/json-to-flat-list.transformer");
const json_to_json_masked_transformer_1 = require("../../shared/transformers/json-to-json-masked.transformer");
const json_to_yaml_transformer_1 = require("../../shared/transformers/json-to-yaml.transformer");
const spreadsheet_to_json_string_transformer_1 = require("../../shared/transformers/spreadsheet-to-json-string.transformer");
const spreadsheet_to_json_transformer_1 = require("../../shared/transformers/spreadsheet-to-json.transformer");
const transformers_1 = require("../../shared/transformers/transformers");
const android_files_creator_1 = require("./files-creators/android-files.creator");
const files_creators_1 = require("./files-creators/files-creators");
const ios_files_creator_1 = require("./files-creators/ios-files.creator");
const json_files_creator_1 = require("./files-creators/json-files.creator");
const xlf_files_creator_1 = require("./files-creators/xlf-files.creator");
const yaml_files_creator_1 = require("./files-creators/yaml-files.creator");
const interpreter_1 = require("./interpreter/interpreter");
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
        filesCreators: awilix.asClass(files_creators_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            filesCreators: [
                container.resolve('androidFilesCreator'),
                container.resolve('iosFilesCreator'),
                container.resolve('jsonFilesCreator'),
                container.resolve('xlfFilesCreator'),
                container.resolve('yamlFilesCreator'),
            ],
        })),
    };
    const transformersRegistry = {
        jsonToJsonMaskedTransformer: awilix.asClass(json_to_json_masked_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        flatListToIosStringsTransformer: awilix.asClass(flat_list_to_ios_strings_transformer_1.default, {
            lifetime: awilix.Lifetime.SINGLETON,
        }),
        flatListToXlfTransformer: awilix.asClass(flat_list_to_xlf_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
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
        transformers: awilix.asClass(transformers_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            transformers: [
                container.resolve('spreadsheetToJsonStringTransformer'),
                container.resolve('spreadsheetToXmlTransformer'),
                container.resolve('spreadsheetToIosStringsTransformer'),
                container.resolve('spreadsheetToXlfTransformer'),
                container.resolve('spreadsheetToYamlTransformer'),
            ],
        })),
    };
    container.register({
        shadowArgs: awilix.asValue(undefined),
        interpreter: awilix.asClass(interpreter_1.default),
        fileRepository: awilix.asClass(file_repository_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        googleAuth: awilix.asClass(auth_1.default),
        googleSheets: awilix.asClass(sheets_1.default),
        logger: awilix.asValue(tsh_node_common_1.winstonLogger),
        inEnvStorage: awilix.asClass(in_env_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        port: awilix.asValue(process.env.BABELSHEET_PORT || 3000),
        ...maskProviders,
        ...tokenProviders,
        ...transformersRegistry,
        ...fileCreatorsRegistry,
    });
    return container;
}
exports.default = createContainer;
