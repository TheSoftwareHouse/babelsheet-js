"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix = require("awilix");
const tsh_node_common_1 = require("tsh-node-common");
const in_redis_1 = require("../../infrastructure/storage/in-redis");
const handler_1 = require("../../shared/error/handler");
const mask_converter_1 = require("../../shared/mask/mask.converter");
const mask_input_1 = require("../../shared/mask/mask.input");
const flat_list_to_ios_strings_transformer_1 = require("../../shared/transformers/flat-list-to-ios-strings.transformer");
const flat_list_to_xlf_transformer_1 = require("../../shared/transformers/flat-list-to-xlf.transformer");
const flat_list_to_xml_transformer_1 = require("../../shared/transformers/flat-list-to-xml.transformer");
const json_to_flat_list_transformer_1 = require("../../shared/transformers/json-to-flat-list.transformer");
const json_to_ios_strings_transformer_1 = require("../../shared/transformers/json-to-ios-strings.transformer");
const json_to_json_masked_transformer_1 = require("../../shared/transformers/json-to-json-masked.transformer");
const json_to_json_transformer_1 = require("../../shared/transformers/json-to-json.transformer");
const json_to_xlf_transformer_1 = require("../../shared/transformers/json-to-xlf.transformer");
const json_to_xml_transformer_1 = require("../../shared/transformers/json-to-xml.transformer");
const json_to_yaml_transformer_1 = require("../../shared/transformers/json-to-yaml.transformer");
const transformers_1 = require("../../shared/transformers/transformers");
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
    const transformersRegistry = {
        flatListToIosStringsTransformer: awilix.asClass(flat_list_to_ios_strings_transformer_1.default, {
            lifetime: awilix.Lifetime.SINGLETON,
        }),
        flatListToXlfTransformer: awilix.asClass(flat_list_to_xlf_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        flatListToXmlTransformer: awilix.asClass(flat_list_to_xml_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        jsonToJsonMaskedTransformer: awilix.asClass(json_to_json_masked_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        jsonToFlatListTransformer: awilix.asClass(json_to_flat_list_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        jsonToJsonTransformer: awilix.asClass(json_to_json_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        jsonToXmlTransformer: awilix.asClass(json_to_xml_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            jsonToFlatList: container.resolve('jsonToFlatListTransformer'),
            flatListToXml: container.resolve('flatListToXmlTransformer'),
        })),
        jsonToIosStringsTransformer: awilix
            .asClass(json_to_ios_strings_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON })
            .inject(() => ({
            jsonToFlatList: container.resolve('jsonToFlatListTransformer'),
            flatListToIosStrings: container.resolve('flatListToIosStringsTransformer'),
        })),
        jsonToXlfTransformer: awilix.asClass(json_to_xlf_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            jsonToFlatList: container.resolve('jsonToFlatListTransformer'),
            flatListToXlf: container.resolve('flatListToXlfTransformer'),
        })),
        jsonToYamlTransformer: awilix.asClass(json_to_yaml_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        transformers: awilix.asClass(transformers_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            transformers: [
                container.resolve('jsonToXmlTransformer'),
                container.resolve('jsonToIosStringsTransformer'),
                container.resolve('jsonToJsonTransformer'),
                container.resolve('jsonToXlfTransformer'),
                container.resolve('jsonToYamlTransformer'),
            ],
        })),
    };
    container.register({
        errorHandler: awilix.asClass(handler_1.default),
        logger: awilix.asValue(tsh_node_common_1.winstonLogger),
        maskConverter: awilix.asClass(mask_converter_1.default),
        maskInput: awilix.asClass(mask_input_1.default),
        maskedTranslations: awilix.asClass(masked_translations_1.default),
        port: awilix.asValue(process.env.BABELSHEET_PORT || 3000),
        server: awilix.asClass(server_1.default),
        storage: awilix.asClass(in_redis_1.default),
        translationsController: awilix.asClass(translations_controller_1.default),
        translationsKeyGenerator: awilix.asClass(translations_key_generator_1.default),
        translationsRouting: awilix.asClass(translations_routing_1.default),
        translationsStorage: awilix.asClass(cached_translations_1.default),
        ...transformersRegistry,
    });
    return container;
}
exports.default = createContainer;
