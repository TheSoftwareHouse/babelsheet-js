import * as awilix from "awilix";
import { AwilixContainer, ContainerOptions, NameAndRegistrationPair } from "awilix";
import { winstonLogger } from "../shared/logger/logger";
import InEnvStorage from "../shared/storage/inEnv";
import InRedisStorage from "../shared/storage/inRedis";
import TranslationsStorage from "../shared/translations/translations";
import GoogleAuth from "./google/auth";
import GoogleSheets from "./google/sheets";
import TokenStorage from "./token/token";
import ToJsonTransformer from "./transformer/toJson.transformer";

export default function createContainer(
  options?: ContainerOptions,
  registrations?: NameAndRegistrationPair
): AwilixContainer {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
    ...options
  });

  container.register({
    googleAuth: awilix.asClass(GoogleAuth),
    googleSheets: awilix.asClass(GoogleSheets),
    inEnvStorage: awilix.asClass(InEnvStorage),
    logger: awilix.asValue(winstonLogger),
    port: awilix.asValue(process.env.PORT || 3000),
    storage: awilix.asClass(InRedisStorage),
    tokenStorage: awilix
      .asClass(TokenStorage)
      .inject(() => ({ storage: container.resolve<InEnvStorage>("inEnvStorage") })),
    transformer: awilix.asClass(ToJsonTransformer),
    translationsStorage: awilix.asClass(TranslationsStorage),
    ...registrations
  });

  return container;
}
