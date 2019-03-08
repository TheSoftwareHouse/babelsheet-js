import * as awilix from 'awilix';
import { generateTranslations, generateConfigFile } from './fileGenerators';
import createContainer from './container';
import { ITransformers } from '../../shared/transformers/transformers.types';
import { getGoogleAuthMock } from '../../tests/googleAuthMock';
import { getLoggerMock } from '../../tests/loggerMock';
import InEnvStorage from '../../infrastructure/storage/in-env';

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
};

describe('fileGenerators', async () => {
  it('generateTranslations does run proper functions', async () => {
    const mockGoogleSheets = {
      fetchSpreadsheet: jest
        .fn()
        .mockImplementation(() => ({ Sheet1: 'firstSpreadsheet', Sheet2: 'secondSpreadsheet' })),
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

    await generateTranslations(container, args);

    expect(mockGoogleSheets.fetchSpreadsheet).toHaveBeenCalledTimes(1);
    expect(mockTransformers.transform).toHaveBeenNthCalledWith(
      1,
      'firstSpreadsheet',
      'json',
      args.language,
      args.merge
    );
    expect(mockTransformers.transform).toHaveBeenNthCalledWith(
      2,
      'secondSpreadsheet',
      'json',
      args.language,
      args.merge
    );
    expect(mockFileCreators.save).toHaveBeenNthCalledWith(
      1,
      'transformReturn',
      args.path,
      args.filename,
      'json',
      args.base,
      'Sheet1'
    );
    expect(mockFileCreators.save).toHaveBeenNthCalledWith(
      2,
      'transformReturn',
      args.path,
      args.filename,
      'json',
      args.base,
      'Sheet2'
    );
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

    await generateConfigFile(container, args, inEnvStorage);

    expect(mockInEnvStorage.set).toBeCalledWith('babelsheet_refresh_token', 'test-token');
  });
});
