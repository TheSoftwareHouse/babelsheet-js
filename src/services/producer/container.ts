import * as awilix from 'awilix';
import { AwilixContainer, ContainerOptions } from 'awilix';
import { winstonLogger } from 'node-common';
import InEnvStorage from '../../infrastructure/storage/in-env';
import InRedisStorage from '../../infrastructure/storage/in-redis';
import MaskConverter from '../../shared/mask/mask.converter';
import MaskInput from '../../shared/mask/mask.input';
import MaskedTranslations from '../../shared/translations/masked-translations';
import GoogleAuth from '../../shared/google/auth';
import GoogleSheets from '../../shared/google/sheets';
import TokenStorage from '../../shared/token/token';
import ToJsonTransformer from './transformer/to-json.transformer';

export default function createContainer(options?: ContainerOptions): AwilixContainer {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
    ...options,
  });

  container.register({
    googleAuth: awilix.asClass(GoogleAuth),
    googleSheets: awilix.asClass(GoogleSheets),
    inEnvStorage: awilix.asClass(InEnvStorage, { lifetime: awilix.Lifetime.SINGLETON }),
    logger: awilix.asValue(winstonLogger),
    maskConverter: awilix.asClass(MaskConverter),
    maskInput: awilix.asClass(MaskInput),
    port: awilix.asValue(process.env.PORT || 3000),
    storage: awilix.asClass(InRedisStorage),
    tokenStorage: awilix
      .asClass(TokenStorage)
      .inject(() => ({ storage: container.resolve<InEnvStorage>('inEnvStorage') })),
    transformer: awilix.asClass(ToJsonTransformer),
    translationsStorage: awilix.asClass(MaskedTranslations),
  });

  return container;
}
