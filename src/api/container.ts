import * as awilix from 'awilix';
import { AwilixContainer, ContainerOptions } from 'awilix';
import ErrorHandler from '../shared/error/handler';
import { winstonLogger } from '../shared/logger/logger';
import InRedisStorage from '../shared/storage/in-redis';
import CachedTranslations from '../shared/translations/cached-translations';
import MaskedTranslations from '../shared/translations/masked-translations';
import MaskConverter from './mask/mask.converter';
import MaskInput from './mask/mask.input';
import Server from './server/server';
import TranslationsController from './translations/translations.controller';
import TranslationsKeyGenerator from './translations/translations.key-generator';
import TranslationsRouting from './translations/translations.routing';

export default function createContainer(options?: ContainerOptions): AwilixContainer {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
    ...options,
  });

  container.register({
    errorHandler: awilix.asClass(ErrorHandler),
    logger: awilix.asValue(winstonLogger),
    maskConverter: awilix.asClass(MaskConverter),
    maskInput: awilix.asClass(MaskInput),
    maskedTranslations: awilix.asClass(MaskedTranslations),
    port: awilix.asValue(process.env.PORT || 3000),
    server: awilix.asClass(Server),
    storage: awilix.asClass(InRedisStorage),
    translationsController: awilix.asClass(TranslationsController),
    translationsKeyGenerator: awilix.asClass(TranslationsKeyGenerator),
    translationsRouting: awilix.asClass(TranslationsRouting),
    translationsStorage: awilix.asClass(CachedTranslations),
  });

  return container;
}
