import * as awilix from 'awilix';
import { AwilixContainer, ContainerOptions } from 'awilix';
import { winstonLogger } from 'tsh-node-common';
import FileRepository from '../../infrastructure/repository/file.repository';
import InEnvStorage from '../../infrastructure/storage/in-env';
import InFileStorage from '../../infrastructure/storage/in-file';
import InRedisStorage from '../../infrastructure/storage/in-redis';
import GoogleAuth from '../../shared/google/auth';
import GoogleSheets from '../../shared/google/sheets';
import MaskConverter from '../../shared/mask/mask.converter';
import MaskInput from '../../shared/mask/mask.input';
import TokenProvider from '../../shared/token-provider/token-provider';
import SpreadsheetToJsonTransformer from '../../shared/transformers/spreadsheet-to-json.transformer';
import MaskedTranslations from '../../shared/translations/masked-translations';

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

  container.register({
    fileRepository: awilix.asClass(FileRepository, { lifetime: awilix.Lifetime.SINGLETON }),
    googleAuth: awilix.asClass(GoogleAuth),
    googleSheets: awilix.asClass(GoogleSheets),
    logger: awilix.asValue(winstonLogger),
    maskConverter: awilix.asClass(MaskConverter),
    maskInput: awilix.asClass(MaskInput),
    port: awilix.asValue(process.env.BABELSHEET_PORT || 3000),
    storage: awilix.asClass(InRedisStorage),
    transformer: awilix.asClass(SpreadsheetToJsonTransformer),
    translationsStorage: awilix.asClass(MaskedTranslations),
    ...tokenProviders,
  });

  return container;
}
