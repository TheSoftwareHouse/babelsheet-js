import * as awilix from 'awilix';
import { AwilixContainer, ContainerOptions } from 'awilix';
import { winstonLogger } from 'node-common';
import InEnvStorage from '../../infrastructure/storage/in-env';
import GoogleAuth from '../../shared/google/auth';
import GoogleSheets from '../../shared/google/sheets';
import TokenStorage from '../../shared/token/token';
import Formatter from './formater';

export default function createContainer(options?: ContainerOptions): AwilixContainer {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
    ...options,
  });

  container.register({
    googleAuth: awilix.asClass(GoogleAuth),
    googleSheets: awilix.asClass(GoogleSheets),
    inEnvStorage: awilix.asClass(InEnvStorage, { lifetime: awilix.Lifetime.SINGLETON }),
    tokenStorage: awilix
      .asClass(TokenStorage)
      .inject(() => ({ storage: container.resolve<InEnvStorage>('inEnvStorage') })),
    port: awilix.asValue(process.env.PORT || 3000),
    logger: awilix.asValue(winstonLogger),
    formatter: awilix.asClass(Formatter),
  });

  return container;
}
