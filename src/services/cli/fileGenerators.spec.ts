import * as awilix from 'awilix';
import { generateTranslations, generateEnvConfigFile, generateJsonConfigFile } from './fileGenerators';
import createContainer from './container';
import { ITransformers } from '../../shared/transformers/transformers.types';
import { getGoogleAuthMock } from '../../tests/googleAuthMock';

export const getExtension = jest.fn();

const loggerMock = {
  info: () => null,
  error: () => null,
};

const args = {
  _: ['test', 'test2'],
  $0: 'test',
  format: 'json',
  client_id: 'test',
  client_secret: 'test2',
  spreadsheet_id: 'test3',
  spreadsheet_name: 'test4',
  path: '.',
  language: 'test-lang',
  merge: false,
  filename: 'test-filename',
};

describe('fileGenerators', async () => {
  it('generateTranslations does run proper functions', async () => {
    const mockGoogleSheets = {
      fetchSpreadsheet: jest.fn().mockImplementation(() => 'fetchSpreadsheetReturn'),
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

    expect(mockGoogleSheets.fetchSpreadsheet).toBeCalled();
    expect(mockTransformers.transform).toBeCalledWith('fetchSpreadsheetReturn', 'json', args.language, args.merge);
    expect(mockFileCreators.save).toBeCalledWith('transformReturn', args.path, args.filename, 'json', args.default);
  });

  it('generateEnvConfigFile does run proper env storage', async () => {
    const mockInEnvStorage = {
      set: jest.fn(),
    };

    const container = createContainer().register({
      logger: awilix.asValue(loggerMock),
      inEnvStorage: awilix.asValue(mockInEnvStorage),
      googleAuth: awilix.asValue(getGoogleAuthMock()),
    });

    await generateEnvConfigFile(container, args);

    expect(mockInEnvStorage.set).toBeCalledWith('refresh_token', 'test-token');
  });

  it('generateJsonConfigFile does run proper json storage', async () => {
    const mockInFileStorage = {
      set: jest.fn(),
    };

    const container = createContainer().register({
      logger: awilix.asValue(loggerMock),
      inFileStorage: awilix.asValue(mockInFileStorage),
      googleAuth: awilix.asValue(getGoogleAuthMock()),
    });

    await generateJsonConfigFile(container, args);

    expect(mockInFileStorage.set).toBeCalledWith('refresh_token', 'test-token');
  });
});
