import * as awilix from 'awilix';
import { AwilixContainer, ContainerOptions } from 'awilix';
import { winstonLogger } from 'node-common';
import FileRepository from '../../infrastructure/repository/file.repository';
import InFileStorage from '../../infrastructure/storage/in-file';
import GoogleAuth from '../../shared/google/auth';
import GoogleSheets from '../../shared/google/sheets';
import TokenStorage from '../../shared/token/token';
import ToJsonTransformer from '../../shared/transformers/to-json.transformer';
import Transformers from './transformers';

export default function createContainer(options?: ContainerOptions): AwilixContainer {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
    ...options,
  });

  container.register({
    fileRepository: awilix.asClass(FileRepository, { lifetime: awilix.Lifetime.SINGLETON }),
    googleAuth: awilix.asClass(GoogleAuth),
    googleSheets: awilix.asClass(GoogleSheets),
    logger: awilix.asValue(winstonLogger),
    inFileStorage: awilix.asClass(InFileStorage, { lifetime: awilix.Lifetime.SINGLETON }),
    port: awilix.asValue(process.env.PORT || 3000),
    tokenStorage: awilix
      .asClass(TokenStorage)
      .inject(() => ({ storage: container.resolve<InFileStorage>('inFileStorage') })),
    transformers: awilix.asClass(Transformers).inject(() => ({
      transformers: [new ToJsonTransformer()],
    })),
  });

  return container;
}
