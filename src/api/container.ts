import * as awilix from "awilix";
import { AwilixContainer, ContainerOptions, NameAndRegistrationPair } from "awilix";
import ErrorHandler from "../shared/error/handler";
import { winstonLogger } from "../shared/logger/logger";
import InRedisStorage from "../shared/storage/inRedis";
import TranslationsStorage from "../shared/translations/translations";
import Server from "./server/server";
import TranslationsController from "./translations/translations.controller";
import TranslationsRouting from "./translations/translations.routing";

export default function createContainer(
  options?: ContainerOptions,
  registrations?: NameAndRegistrationPair
): AwilixContainer {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
    ...options
  });

  container.register({
    errorHandler: awilix.asClass(ErrorHandler),
    logger: awilix.asValue(winstonLogger),
    port: awilix.asValue(process.env.PORT || 3000),
    server: awilix.asClass(Server),
    storage: awilix.asClass(InRedisStorage),
    translationsController: awilix.asClass(TranslationsController),
    translationsRouting: awilix.asClass(TranslationsRouting),
    translationsStorage: awilix.asClass(TranslationsStorage),
    ...registrations
  });

  return container;
}
