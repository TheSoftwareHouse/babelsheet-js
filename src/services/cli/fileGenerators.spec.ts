import * as awilix from 'awilix';
import { generateTranslations, generateEnvConfigFile, generateJsonConfigFile } from './fileGenerators';
import createContainer from './container';
import GoogleSheets from '../../shared/google/sheets';
import { ITransformers } from '../../shared/transformers/transformers.types';

export const getExtension = jest.fn();

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
      googleSheets: awilix.asValue(mockGoogleSheets),
      transformers: awilix.asValue(mockTransformers),
      filesCreators: awilix.asValue(mockFileCreators),
    });
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
    await generateTranslations(container, args);

    expect(mockGoogleSheets.fetchSpreadsheet).toBeCalled();
    expect(mockTransformers.transform).toBeCalledWith('fetchSpreadsheetReturn', 'json', args.language, args.merge);
    expect(mockFileCreators.save).toBeCalledWith('transformReturn', args.path, args.filename, 'json');
  });

  it('generateEnvConfigFile does run proper env storage', async () => {
    const mockInEnvStorage = {
      set: jest.fn(),
    };

    const mockGoogleAuth = {
      createOAuthClient: jest.fn(),
      getTokens: jest.fn().mockImplementation(() => ({ refresh_token: 'test-token' })),
    };

    const container = createContainer().register({
      inEnvStorage: awilix.asValue(mockInEnvStorage),
      googleAuth: awilix.asValue(mockGoogleAuth),
    });
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

    await generateEnvConfigFile(container, args);

    expect(mockInEnvStorage.set).toBeCalledWith('refresh_token', 'test-token');
  });

  it('generateJsonConfigFile does run proper json storage', async () => {
    const mockInFileStorage = {
      set: jest.fn(),
    };

    const mockGoogleAuth = {
      createOAuthClient: jest.fn(),
      getTokens: jest.fn().mockImplementation(() => ({ refresh_token: 'test-token' })),
    };

    const container = createContainer().register({
      inFileStorage: awilix.asValue(mockInFileStorage),
      googleAuth: awilix.asValue(mockGoogleAuth),
    });
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

    await generateJsonConfigFile(container, args);

    expect(mockInFileStorage.set).toBeCalledWith('refresh_token', 'test-token');
  });
});
