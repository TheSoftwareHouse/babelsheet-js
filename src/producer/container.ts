import * as awilix from "awilix";
import { winstonLogger } from "../shared/logger";
import InFileStorage from "../shared/storage/inFile";
import TranslationsStorage from "../shared/translations";
import { AwilixContainer, ContainerOptions, NameAndRegistrationPair } from "awilix";
import GoogleAuth from "./google/auth";
import GoogleSheets from "./google/sheets";
import TokenStorage from "./tokenStorage";

export default function createContainer(
  options?: ContainerOptions,
  registrations?: NameAndRegistrationPair
): AwilixContainer {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
    ...options
  });

  container.register({
    port: awilix.asValue(process.env.PORT || 3000),
    logger: awilix.asValue(winstonLogger),
    storage: awilix.asClass(InFileStorage),
    translationsStorage: awilix.asClass(TranslationsStorage),
    googleAuth: awilix.asClass(GoogleAuth),
    googleSheets: awilix.asClass(GoogleSheets),
    tokenStorage: awilix.asClass(TokenStorage),
    ...registrations
  });

  return container;
}
