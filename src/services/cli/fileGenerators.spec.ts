import * as awilix from 'awilix';
import { generateTranslations, generateConfigFile } from './fileGenerators';
import createContainer from './container';
import { ITransformers } from '../../shared/transformers/transformers.types';
import { getGoogleAuthMock } from '../../tests/googleAuthMock';
import { getLoggerMock } from '../../tests/loggerMock';
import InEnvStorage from '../../infrastructure/storage/in-env';
import IFileRepository from '../../infrastructure/repository/file-repository.types';

export const getExtension = jest.fn();

const loggerMock = getLoggerMock();

const args = {
  _: ['test', 'test2'],
  $0: 'test',
  format: 'json',
  'client-id': 'test',
  'client-secret': 'test2',
  'spreadsheet-id': 'test3',
  'spreadsheet-name': 'test4',
  path: '.',
  language: 'test-lang',
  merge: false,
  filename: 'test-filename',
  base: 'pl',
  filters: [],
};

describe('fileGenerators', async () => {
  it('generateTranslations does run proper functions', async () => {
    const mockGoogleSheets = {
      fetchSpreadsheet: jest.fn().mockImplementation(() => 'fetchSpreadsheetReturn'),
      googleAuth: jest.fn(),
    };

    const mockTransformers: ITransformers = {
      transform: jest.fn().mockImplementation(() => 'transformReturn'),
    };

    const mockFileCreators = {
      save: jest.fn(),
    };

    const container = createContainer().register({
      logger: awilix.asValue(loggerMock),
      googleSheets: awilix.asValue(mockGoogleSheets),
      transformers: awilix.asValue(mockTransformers),
      filesCreators: awilix.asValue(mockFileCreators),
    });
    const fileRepository = container.resolve<IFileRepository>('fileRepository');
    await generateTranslations(
      loggerMock,
      fileRepository,
      mockGoogleSheets as any,
      mockTransformers as any,
      mockFileCreators as any,
      args
    );

    expect(mockGoogleSheets.fetchSpreadsheet).toBeCalled();
    expect(mockTransformers.transform).toBeCalledWith(
      {
        result: 'fetchSpreadsheetReturn',
        translations: {},
        meta: {
          langCode: args.language,
          mergeLanguages: args.merge,
          filters: args.filters,
        },
      },
      'json'
    );
    expect(mockFileCreators.save).toBeCalledWith('transformReturn', args.path, args.filename, 'json', args.base);
  });

  it('generateConfigFile does run storage', async () => {
    const mockInEnvStorage = {
      set: jest.fn(),
    };

    const container = createContainer().register({
      logger: awilix.asValue(loggerMock),
      inEnvStorage: awilix.asValue(mockInEnvStorage),
      googleAuth: awilix.asValue(getGoogleAuthMock()),
    });

    const inEnvStorage = container.resolve<InEnvStorage>('inEnvStorage');

    await generateConfigFile(loggerMock, inEnvStorage, getGoogleAuthMock() as any, args, inEnvStorage);

    expect(mockInEnvStorage.set).toBeCalledWith('babelsheet_refresh_token', 'test-token');
  });
});
