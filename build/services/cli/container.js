"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const awilix = require("awilix");
const node_common_1 = require("node-common");
const file_repository_1 = require("../../infrastructure/repository/file.repository");
const in_file_1 = require("../../infrastructure/storage/in-file");
const auth_1 = require("../../shared/google/auth");
const sheets_1 = require("../../shared/google/sheets");
const token_1 = require("../../shared/token/token");
const flat_list_to_ios_strings_transformer_1 = require("../../shared/transformers/flat-list-to-ios-strings.transformer");
const flat_list_to_xml_transformer_1 = require("../../shared/transformers/flat-list-to-xml.transformer");
const json_to_flat_list_transformer_1 = require("../../shared/transformers/json-to-flat-list.transformer");
const spreadsheet_to_ios_strings_transformer_1 = require("../../shared/transformers/spreadsheet-to-ios-strings.transformer");
const spreadsheet_to_json_string_transformer_1 = require("../../shared/transformers/spreadsheet-to-json-string.transformer");
const spreadsheet_to_json_transformer_1 = require("../../shared/transformers/spreadsheet-to-json.transformer");
const spreadsheet_to_xml_transformer_1 = require("../../shared/transformers/spreadsheet-to-xml.transformer");
const transformers_1 = require("./transformers");
function createContainer(options) {
    const container = awilix.createContainer({
        injectionMode: awilix.InjectionMode.CLASSIC,
        ...options,
    });
    const transformersRegistry = {
        flatListToIosStrings: awilix.asClass(flat_list_to_ios_strings_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        flatListToXmlTransformer: awilix.asClass(flat_list_to_xml_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        jsonToFlatListTransformer: awilix.asClass(json_to_flat_list_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        spreadsheetToJsonTransformer: awilix.asClass(spreadsheet_to_json_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        spreadsheetToIosStringsTransformer: awilix
            .asClass(spreadsheet_to_ios_strings_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON })
            .inject(() => ({
            spreadsheetToJson: container.resolve('spreadsheetToJsonTransformer'),
            jsonToFlatList: container.resolve('jsonToFlatListTransformer'),
            flatListToIosStrings: container.resolve('flatListToIosStrings'),
        })),
        spreadsheetToJsonStringTransformer: awilix
            .asClass(spreadsheet_to_json_string_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON })
            .inject(() => ({
            spreadsheetToJson: container.resolve('spreadsheetToJsonTransformer'),
        })),
        spreadsheetToXmlTransformer: awilix
            .asClass(spreadsheet_to_xml_transformer_1.default, { lifetime: awilix.Lifetime.SINGLETON })
            .inject(() => ({
            spreadsheetToJson: container.resolve('spreadsheetToJsonTransformer'),
            jsonToFlatList: container.resolve('jsonToFlatListTransformer'),
            flatListToXml: container.resolve('flatListToXmlTransformer'),
        })),
        transformers: awilix.asClass(transformers_1.default, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
            transformers: [
                container.resolve('spreadsheetToJsonStringTransformer'),
                container.resolve('spreadsheetToXmlTransformer'),
                container.resolve('spreadsheetToIosStringsTransformer'),
            ],
        })),
    };
    container.register({
        fileRepository: awilix.asClass(file_repository_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        googleAuth: awilix.asClass(auth_1.default),
        googleSheets: awilix.asClass(sheets_1.default),
        logger: awilix.asValue(node_common_1.winstonLogger),
        inFileStorage: awilix.asClass(in_file_1.default, { lifetime: awilix.Lifetime.SINGLETON }),
        port: awilix.asValue(process.env.PORT || 3000),
        tokenStorage: awilix
            .asClass(token_1.default)
            .inject(() => ({ storage: container.resolve('inFileStorage') })),
        ...transformersRegistry,
    });
    return container;
}
exports.default = createContainer;
