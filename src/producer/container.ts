import * as awilix from 'awilix';
import { AwilixContainer, ContainerOptions } from 'awilix';
import MaskConverter from '../api/mask/mask.converter';
import MaskInput from '../api/mask/mask.input';
import { winstonLogger } from '../shared/logger/logger';
import InEnvStorage from '../shared/storage/in-env';
import InRedisStorage from '../shared/storage/in-redis';
import MaskedTranslations from '../shared/translations/masked-translations';
import GoogleAuth from './google/auth';
import GoogleSheets from './google/sheets';
import TokenStorage from './token/token';
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
