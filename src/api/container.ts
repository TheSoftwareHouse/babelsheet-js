import * as awilix from "awilix";
import Server from "./server";
import { winstonLogger } from "../shared/logger";
import InFileStorage from "../shared/storage/inFile";
import TranslationsStorage from "../shared/translations";
import { AwilixContainer, ContainerOptions, NameAndRegistrationPair } from "awilix";
import ErrorHandler from "../shared/error/handler";

export default function createContainer(
  options?: ContainerOptions,
  registrations?: NameAndRegistrationPair
): AwilixContainer {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
    ...options
  });

  container.register({
    server: awilix.asClass(Server),
    logger: awilix.asValue(winstonLogger),
    port: awilix.asValue(process.env.PORT || 3000),
    storage: awilix.asClass(InFileStorage),
    translationsStorage: awilix.asClass(TranslationsStorage),
    errorHandler: awilix.asClass(ErrorHandler),
    ...registrations
  });

  return container;
}
