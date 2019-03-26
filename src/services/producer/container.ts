import * as awilix from 'awilix';
import { AwilixContainer, ContainerOptions } from 'awilix';
import { winstonLogger } from 'tsh-node-common';
import FileRepository from '../../infrastructure/repository/file.repository';
import InEnvStorage from '../../infrastructure/storage/in-env';
import InFileStorage from '../../infrastructure/storage/in-file';
import InRedisStorage from '../../infrastructure/storage/in-redis';
import GoogleAuth from '../../shared/google/auth';
import MaskConverter from '../../shared/mask/mask.converter';
import MaskInput from '../../shared/mask/mask.input';
import GoogleSheetsProvider from '../../shared/sheets-provider/google-sheets.provider';
import InFileSheetsProvider from '../../shared/sheets-provider/in-file-sheets.provider';
import { SheetsProviderFactory } from '../../shared/sheets-provider/sheets-provider.factory';
import TokenProvider from '../../shared/token-provider/token-provider';
import JsonToJsonMaskedTransformer from '../../shared/transformers/json-to-json-masked.transformer';
import SpreadsheetToJsonTransformer from '../../shared/transformers/spreadsheet-to-json.transformer';
import MaskedTranslations from '../../shared/translations/masked-translations';
import { ConfigProviderFactory } from '../cli/spreadsheet-config-providers/config-provider.factory';
import { GoogleSpreadsheetConfigService } from '../cli/spreadsheet-config-providers/google-spreadsheet-config.provider';
import { InFileSpreadsheetConfigService } from '../cli/spreadsheet-config-providers/in-file-spreadsheet-config.provider';
import TranslationsProducer from './translations-producer/translations-producer';

export default function createContainer(options?: ContainerOptions): AwilixContainer {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
    ...options,
  });

  const tokenProviders = {
    inEnvStorage: awilix.asClass(InEnvStorage, { lifetime: awilix.Lifetime.SINGLETON }),
    inFileStorage: awilix.asClass(InFileStorage, { lifetime: awilix.Lifetime.SINGLETON }),
    inRedisStorage: awilix.asClass(InRedisStorage, { lifetime: awilix.Lifetime.SINGLETON }),
    tokenProvider: awilix.asClass(TokenProvider).inject(() => ({
      writeProvider: container.resolve<InEnvStorage>('inEnvStorage'),
      readProviders: [
        container.resolve<InEnvStorage>('inEnvStorage'),
        container.resolve<InFileStorage>('inFileStorage'),
        container.resolve<InRedisStorage>('inRedisStorage'),
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

  container.register({
    fileRepository: awilix.asClass(FileRepository, { lifetime: awilix.Lifetime.SINGLETON }),
    googleAuth: awilix.asClass(GoogleAuth),
    googleSheets: awilix.asClass(GoogleSheetsProvider),
    logger: awilix.asValue(winstonLogger),
    maskConverter: awilix.asClass(MaskConverter),
    maskInput: awilix.asClass(MaskInput),
    port: awilix.asValue(process.env.BABELSHEET_PORT || 3000),
    storage: awilix.asClass(InRedisStorage),
    transformer: awilix.asClass(SpreadsheetToJsonTransformer),
    jsonToJsonMaskedTransformer: awilix.asClass(JsonToJsonMaskedTransformer),
    translationsStorage: awilix.asClass(MaskedTranslations),
    translationsProducer: awilix.asClass(TranslationsProducer),
    ...tokenProviders,
    ...spreadsheetConfigProviderRegistry,
    ...spreadsheetProviderRegistry,
  });

  return container;
}
