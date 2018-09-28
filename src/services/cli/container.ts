import * as awilix from 'awilix';
import { AwilixContainer, ContainerOptions } from 'awilix';
import { winstonLogger } from 'tsh-node-common';
import FileRepository from '../../infrastructure/repository/file.repository';
import InEnvStorage from '../../infrastructure/storage/in-env';
import InFileStorage from '../../infrastructure/storage/in-file';
import GoogleAuth from '../../shared/google/auth';
import GoogleSheets from '../../shared/google/sheets';
import TokenProvider from '../../shared/token-provider/token-provider';
import FlatListToIosStringsTransformer from '../../shared/transformers/flat-list-to-ios-strings.transformer';
import FlatListToXlfTransformer from '../../shared/transformers/flat-list-to-xlf.transformer';
import FlatListToXmlTransformer from '../../shared/transformers/flat-list-to-xml.transformer';
import JsonToFlatListTransformer from '../../shared/transformers/json-to-flat-list.transformer';
import JsonToIosStringsTransformer from '../../shared/transformers/json-to-ios-strings.transformer';
import JsonToXlfTransformer from '../../shared/transformers/json-to-xlf.transformer';
import JsonToXmlTransformer from '../../shared/transformers/json-to-xml.transformer';
import JsonToYamlTransformer from '../../shared/transformers/json-to-yaml.transformer';
import JsonToJsonMaskedTransformer from "../../shared/transformers/json-to-json-masked.transformer";
import SpreadsheetToIosStringsTransformer from '../../shared/transformers/spreadsheet-to-ios-strings.transformer';
import SpreadsheetToJsonStringTransformer from '../../shared/transformers/spreadsheet-to-json-string.transformer';
import SpreadsheetToJsonTransformer from '../../shared/transformers/spreadsheet-to-json.transformer';
import SpreadsheetToXlfTransformer from '../../shared/transformers/spreadsheet-to-xlf.transformer';
import SpreadsheetToXmlTransformer from '../../shared/transformers/spreadsheet-to-xml.transformer';
import SpreadsheetToYamlTransformer from '../../shared/transformers/spreadsheet-to-yaml.transformer';
import Transformers from '../../shared/transformers/transformers';
import AndroidFilesCreator from './files-creators/android-files.creator';
import FilesCreators from './files-creators/files-creators';
import IosFilesCreator from './files-creators/ios-files.creator';
import JsonFilesCreator from './files-creators/json-files.creator';
import XlfFilesCreator from './files-creators/xlf-files.creator';
import YamlFilesCreator from './files-creators/yaml-files.creator';
import MaskConverter from "../../shared/mask/mask.converter";
import MaskInput from "../../shared/mask/mask.input";

export default function createContainer(options?: ContainerOptions): AwilixContainer {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
    ...options,
  });

  const tokenProviders = {
    inEnvStorage: awilix.asClass(InEnvStorage, { lifetime: awilix.Lifetime.SINGLETON }),
    inFileStorage: awilix.asClass(InFileStorage, { lifetime: awilix.Lifetime.SINGLETON }),
    tokenProvider: awilix.asClass(TokenProvider).inject(() => ({
      writeProvider: container.resolve<InEnvStorage>('inEnvStorage'),
      readProviders: [
        container.resolve<InEnvStorage>('inEnvStorage'),
        container.resolve<InFileStorage>('inFileStorage'),
      ],
    })),
  };

  const fileCreatorsRegistry = {
    androidFilesCreator: awilix.asClass(AndroidFilesCreator, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      fileRepository: container.resolve<FileRepository>('fileRepository'),
    })),
    iosFilesCreator: awilix.asClass(IosFilesCreator, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      fileRepository: container.resolve<FileRepository>('fileRepository'),
    })),
    jsonFilesCreator: awilix.asClass(JsonFilesCreator, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      fileRepository: container.resolve<FileRepository>('fileRepository'),
    })),
    xlfFilesCreator: awilix.asClass(XlfFilesCreator, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      fileRepository: container.resolve<FileRepository>('fileRepository'),
    })),
    yamlFilesCreator: awilix.asClass(YamlFilesCreator, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      fileRepository: container.resolve<FileRepository>('fileRepository'),
    })),
    filesCreators: awilix.asClass(FilesCreators, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      filesCreators: [
        container.resolve<AndroidFilesCreator>('androidFilesCreator'),
        container.resolve<IosFilesCreator>('iosFilesCreator'),
        container.resolve<JsonFilesCreator>('jsonFilesCreator'),
        container.resolve<XlfFilesCreator>('xlfFilesCreator'),
        container.resolve<YamlFilesCreator>('yamlFilesCreator'),
      ],
    })),
  };

  const transformersRegistry = {
    maskConverter: awilix.asClass(MaskConverter),
    maskInput: awilix.asClass(MaskInput),
    jsonToJsonMaskedTransformer: awilix
    .asClass(JsonToJsonMaskedTransformer, {lifetime: awilix.Lifetime.SINGLETON}),
    flatListToIosStringsTransformer: awilix.asClass(FlatListToIosStringsTransformer, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    flatListToXlfTransformer: awilix.asClass(FlatListToXlfTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    flatListToXmlTransformer: awilix.asClass(FlatListToXmlTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    jsonToFlatListTransformer: awilix.asClass(JsonToFlatListTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    jsonToIosStringsTransformer: awilix
      .asClass(JsonToIosStringsTransformer, { lifetime: awilix.Lifetime.SINGLETON })
      .inject(() => ({
        jsonToFlatList: container.resolve<JsonToFlatListTransformer>('jsonToFlatListTransformer'),
        flatListToIosStrings: container.resolve<FlatListToIosStringsTransformer>('flatListToIosStringsTransformer'),
      })),
    jsonToXlfTransformer: awilix.asClass(JsonToXlfTransformer, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      jsonToFlatList: container.resolve<JsonToFlatListTransformer>('jsonToFlatListTransformer'),
      flatListToXlf: container.resolve<FlatListToXlfTransformer>('flatListToXlfTransformer'),
    })),
    jsonToXmlTransformer: awilix.asClass(JsonToXmlTransformer, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      jsonToFlatList: container.resolve<JsonToFlatListTransformer>('jsonToFlatListTransformer'),
      flatListToXml: container.resolve<FlatListToXmlTransformer>('flatListToXmlTransformer'),
    })),
    jsonToYamlTransformer: awilix.asClass(JsonToYamlTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    spreadsheetToJsonTransformer: awilix.asClass(SpreadsheetToJsonTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    spreadsheetToIosStringsTransformer: awilix
      .asClass(SpreadsheetToIosStringsTransformer, { lifetime: awilix.Lifetime.SINGLETON })
      .inject(() => ({
        spreadsheetToJson: container.resolve<SpreadsheetToJsonTransformer>('spreadsheetToJsonTransformer'),
        jsonToIosStrings: container.resolve<JsonToIosStringsTransformer>('jsonToIosStringsTransformer'),
        jsonToJsonMasked: container.resolve<JsonToJsonMaskedTransformer>('jsonToJsonMaskedTransformer'),
      })),
    spreadsheetToJsonStringTransformer: awilix
      .asClass(SpreadsheetToJsonStringTransformer, { lifetime: awilix.Lifetime.SINGLETON })
      .inject(() => ({
        spreadsheetToJson: container.resolve<SpreadsheetToJsonTransformer>('spreadsheetToJsonTransformer'),
        jsonToJsonMasked: container.resolve<JsonToJsonMaskedTransformer>('jsonToJsonMaskedTransformer'),
      })),
    spreadsheetToXlfTransformer: awilix
      .asClass(SpreadsheetToXlfTransformer, { lifetime: awilix.Lifetime.SINGLETON })
      .inject(() => ({
        spreadsheetToJson: container.resolve<SpreadsheetToJsonTransformer>('spreadsheetToJsonTransformer'),
        jsonToXlf: container.resolve<JsonToXlfTransformer>('jsonToXlfTransformer'),
        jsonToJsonMasked: container.resolve<JsonToJsonMaskedTransformer>('jsonToJsonMaskedTransformer'),
      })),
    spreadsheetToXmlTransformer: awilix
      .asClass(SpreadsheetToXmlTransformer, { lifetime: awilix.Lifetime.SINGLETON })
      .inject(() => ({
        spreadsheetToJson: container.resolve<SpreadsheetToJsonTransformer>('spreadsheetToJsonTransformer'),
        jsonToXml: container.resolve<JsonToXmlTransformer>('jsonToXmlTransformer'),
        jsonToJsonMasked: container.resolve<JsonToJsonMaskedTransformer>('jsonToJsonMaskedTransformer'),
      })),
    spreadsheetToYamlTransformer: awilix
      .asClass(SpreadsheetToYamlTransformer, { lifetime: awilix.Lifetime.SINGLETON })
      .inject(() => ({
        spreadsheetToJson: container.resolve<SpreadsheetToJsonTransformer>('spreadsheetToJsonTransformer'),
        jsonToYaml: container.resolve<JsonToYamlTransformer>('jsonToYamlTransformer'),
        jsonToJsonMasked: container.resolve<JsonToJsonMaskedTransformer>('jsonToJsonMaskedTransformer'),
      })),
    transformers: awilix.asClass(Transformers, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      transformers: [
        container.resolve<SpreadsheetToJsonStringTransformer>('spreadsheetToJsonStringTransformer'),
        container.resolve<SpreadsheetToXmlTransformer>('spreadsheetToXmlTransformer'),
        container.resolve<SpreadsheetToIosStringsTransformer>('spreadsheetToIosStringsTransformer'),
        container.resolve<SpreadsheetToXlfTransformer>('spreadsheetToXlfTransformer'),
        container.resolve<SpreadsheetToYamlTransformer>('spreadsheetToYamlTransformer'),      
      ],
    })),
  };

  container.register({
    fileRepository: awilix.asClass(FileRepository, { lifetime: awilix.Lifetime.SINGLETON }),
    googleAuth: awilix.asClass(GoogleAuth),
    googleSheets: awilix.asClass(GoogleSheets),
    logger: awilix.asValue(winstonLogger),
    inEnvStorage: awilix.asClass(InEnvStorage, { lifetime: awilix.Lifetime.SINGLETON }),
    port: awilix.asValue(process.env.BABELSHEET_PORT || 3000),
    ...tokenProviders,
    ...transformersRegistry,
    ...fileCreatorsRegistry,
  });

  return container;
}
