import { AwilixContainer, ContainerOptions } from 'awilix';
import * as awilix from 'awilix';
import { winstonLogger } from 'tsh-node-common';
import FileRepository from '../../infrastructure/repository/file.repository';
import InEnvStorage from '../../infrastructure/storage/in-env';
import InFileStorage from '../../infrastructure/storage/in-file';
import GoogleAuth from '../../shared/google/auth';
import MaskConverter from '../../shared/mask/mask.converter';
import MaskInput from '../../shared/mask/mask.input';
import GoogleSheetsProvider from '../../shared/sheets-provider/google-sheets.provider';
import InFileSheetsProvider from '../../shared/sheets-provider/in-file-sheets.provider';
import TokenProvider from '../../shared/token-provider/token-provider';
import ChainTransformer from '../../shared/transformers/chain.transformer';
import FlatListToIosStringsTransformer from '../../shared/transformers/flat-list-to-ios-strings.transformer';
import FlatListToXlfTransformer from '../../shared/transformers/flat-list-to-xlf.transformer';
import FlatListToXmlTransformer from '../../shared/transformers/flat-list-to-xml.transformer';
import JsonToFlatListTransformer from '../../shared/transformers/json-to-flat-list.transformer';
import JsonToJsonMaskedTransformer from '../../shared/transformers/json-to-json-masked.transformer';
import JsonToYamlTransformer from '../../shared/transformers/json-to-yaml.transformer';
import SpreadsheetToJsonStringTransformer from '../../shared/transformers/spreadsheet-to-json-string.transformer';
import SpreadsheetToJsonTransformer from '../../shared/transformers/spreadsheet-to-json.transformer';
import Transformers from '../../shared/transformers/transformers';
import { SheetsProviderFactory } from './../../shared/sheets-provider/sheets-provider.factory';
import AndroidFilesCreator from './files-creators/android-files.creator';
import FilesCreators from './files-creators/files-creators';
import IosFilesCreator from './files-creators/ios-files.creator';
import JsonFilesCreator from './files-creators/json-files.creator';
import XlfFilesCreator from './files-creators/xlf-files.creator';
import YamlFilesCreator from './files-creators/yaml-files.creator';
import Interpreter from './interpreter/interpreter';
import { ConfigProviderFactory } from './spreadsheet-config-providers/config-provider.factory';
import { GoogleSpreadsheetConfigService } from './spreadsheet-config-providers/google-spreadsheet-config.provider';
import { InFileSpreadsheetConfigService } from './spreadsheet-config-providers/in-file-spreadsheet-config.provider';

export default function createContainer(options?: ContainerOptions): AwilixContainer {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
    ...options,
  });

  const maskProviders = {
    maskConverter: awilix.asClass(MaskConverter),
    maskInput: awilix.asClass(MaskInput),
  };

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

  const spreadsheetConfigProviderRegistry = {
    inFileSpreadsheetConfigProvider: awilix.asClass(InFileSpreadsheetConfigService),
    googleSpreadsheetConfigProvider: awilix.asClass(GoogleSpreadsheetConfigService),
    configProviderFactory: awilix.asClass(ConfigProviderFactory).inject(() => ({
      providers: [
        container.resolve<InFileSpreadsheetConfigService>('inFileSpreadsheetConfigProvider'),
        container.resolve<GoogleSpreadsheetConfigService>('googleSpreadsheetConfigProvider'),
      ],
    })),
  };

  const spreadsheetProviderRegistry = {
    inFileSpreadsheetProvider: awilix.asClass(InFileSheetsProvider),
    googleSpreadsheetProvider: awilix.asClass(GoogleSheetsProvider),
    sheetsProviderFactory: awilix.asClass(SheetsProviderFactory).inject(() => ({
      providers: [
        container.resolve<InFileSheetsProvider>('inFileSpreadsheetProvider'),
        container.resolve<GoogleSheetsProvider>('googleSpreadsheetProvider'),
      ],
    })),
  };

  const transformersRegistry = {
    jsonToJsonMaskedTransformer: awilix.asClass(JsonToJsonMaskedTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    flatListToIosStringsTransformer: awilix.asClass(FlatListToIosStringsTransformer, {
      lifetime: awilix.Lifetime.SINGLETON,
    }),
    flatListToXlfTransformer: awilix.asClass(FlatListToXlfTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    flatListToXmlTransformer: awilix.asClass(FlatListToXmlTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    jsonToFlatListTransformer: awilix.asClass(JsonToFlatListTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    jsonToYamlTransformer: awilix.asClass(JsonToYamlTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    spreadsheetToJsonTransformer: awilix.asClass(SpreadsheetToJsonTransformer, { lifetime: awilix.Lifetime.SINGLETON }),
    spreadsheetToIosStringsTransformer: awilix
      .asClass(ChainTransformer, { lifetime: awilix.Lifetime.SINGLETON })
      .inject(() => ({
        supportedType: 'strings',
        transformers: [
          container.resolve<SpreadsheetToJsonTransformer>('spreadsheetToJsonTransformer'),
          container.resolve<JsonToJsonMaskedTransformer>('jsonToJsonMaskedTransformer'),
          container.resolve<JsonToFlatListTransformer>('jsonToFlatListTransformer'),
          container.resolve<FlatListToIosStringsTransformer>('flatListToIosStringsTransformer'),
        ],
      })),
    spreadsheetToJsonStringTransformer: awilix
      .asClass(SpreadsheetToJsonStringTransformer, { lifetime: awilix.Lifetime.SINGLETON })
      .inject(() => ({
        spreadsheetToJson: container.resolve<SpreadsheetToJsonTransformer>('spreadsheetToJsonTransformer'),
        jsonToJsonMasked: container.resolve<JsonToJsonMaskedTransformer>('jsonToJsonMaskedTransformer'),
      })),
    spreadsheetToXlfTransformer: awilix
      .asClass(ChainTransformer, { lifetime: awilix.Lifetime.SINGLETON })
      .inject(() => ({
        supportedType: 'xlf',
        transformers: [
          container.resolve<SpreadsheetToJsonTransformer>('spreadsheetToJsonTransformer'),
          container.resolve<JsonToJsonMaskedTransformer>('jsonToJsonMaskedTransformer'),
          container.resolve<JsonToFlatListTransformer>('jsonToFlatListTransformer'),
          container.resolve<FlatListToXlfTransformer>('flatListToXlfTransformer'),
        ],
      })),
    spreadsheetToXmlTransformer: awilix
      .asClass(ChainTransformer, { lifetime: awilix.Lifetime.SINGLETON })
      .inject(() => ({
        supportedType: 'xml',
        transformers: [
          container.resolve<SpreadsheetToJsonTransformer>('spreadsheetToJsonTransformer'),
          container.resolve<JsonToJsonMaskedTransformer>('jsonToJsonMaskedTransformer'),
          container.resolve<JsonToFlatListTransformer>('jsonToFlatListTransformer'),
          container.resolve<FlatListToXmlTransformer>('flatListToXmlTransformer'),
        ],
      })),
    spreadsheetToYamlTransformer: awilix
      .asClass(ChainTransformer, { lifetime: awilix.Lifetime.SINGLETON })
      .inject(() => ({
        supportedType: 'yml',
        transformers: [
          container.resolve<SpreadsheetToJsonTransformer>('spreadsheetToJsonTransformer'),
          container.resolve<JsonToJsonMaskedTransformer>('jsonToJsonMaskedTransformer'),
          container.resolve<JsonToYamlTransformer>('jsonToYamlTransformer'),
        ],
      })),
    transformers: awilix.asClass(Transformers, { lifetime: awilix.Lifetime.SINGLETON }).inject(() => ({
      transformers: [
        container.resolve<SpreadsheetToJsonStringTransformer>('spreadsheetToJsonStringTransformer'),
        container.resolve<ChainTransformer>('spreadsheetToXmlTransformer'),
        container.resolve<ChainTransformer>('spreadsheetToIosStringsTransformer'),
        container.resolve<ChainTransformer>('spreadsheetToXlfTransformer'),
        container.resolve<ChainTransformer>('spreadsheetToYamlTransformer'),
      ],
    })),
  };

  container.register({
    shadowArgs: awilix.asValue(undefined),
    interpreter: awilix.asClass(Interpreter),
    fileRepository: awilix.asClass(FileRepository, { lifetime: awilix.Lifetime.SINGLETON }),
    googleAuth: awilix.asClass(GoogleAuth),
    logger: awilix.asValue(winstonLogger),
    inEnvStorage: awilix.asClass(InEnvStorage, { lifetime: awilix.Lifetime.SINGLETON }),
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
