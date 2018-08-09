import * as awilix from 'awilix';
import { AwilixContainer, ContainerOptions } from 'awilix';
import { winstonLogger } from 'node-common';
import FileRepository from '../../infrastructure/repository/file.repository';
import InFileStorage from '../../infrastructure/storage/in-file';
import GoogleAuth from '../../shared/google/auth';
import GoogleSheets from '../../shared/google/sheets';
import TokenStorage from '../../shared/token/token';
import SpreadsheetToJsonStringTransformer from '../../shared/transformers/spreadsheet-to-json-string.transformer';
import SpreadsheetToJsonTransformer from '../../shared/transformers/spreadsheet-to-json.transformer';
import JsonToXmlTransformer from '../../shared/transformers/json-to-xml.transformer';
import SpreadsheetToXmlTransformer from '../../shared/transformers/spreadsheet-to-xml.transformer';
import Transformers from './transformers';

export default function createContainer(options?: ContainerOptions): AwilixContainer {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
    ...options,
  });

  const transformersRegistry = {
    jsonToXmlTransformer: awilix.asClass(JsonToXmlTransformer),
    spreadsheetToJsonTransformer: awilix.asClass(SpreadsheetToJsonTransformer),
    spreadsheetToJsonStringTransformer: awilix.asClass(SpreadsheetToJsonStringTransformer).inject(() => ({
      spreadsheetToJson: container.resolve<SpreadsheetToJsonTransformer>('spreadsheetToJsonTransformer'),
    })),
    spreadsheetToXmlTransformer: awilix.asClass(SpreadsheetToXmlTransformer).inject(() => ({
      spreadsheetToJson: container.resolve<SpreadsheetToJsonTransformer>('spreadsheetToJsonTransformer'),
      jsonToXml: container.resolve<JsonToXmlTransformer>('jsonToXmlTransformer'),
    })),
    transformers: awilix.asClass(Transformers).inject(() => ({
      transformers: [
        container.resolve<SpreadsheetToJsonStringTransformer>('spreadsheetToJsonStringTransformer'),
        container.resolve<SpreadsheetToXmlTransformer>('spreadsheetToXmlTransformer'),
      ],
    })),
  };

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
    ...transformersRegistry,
  });

  return container;
}
