import * as fs from 'fs-extra';
import AndroidFilesCreator from './android-files.creator';

const DEFAULT_VERSION = 'Sheet1';

jest.mock('fs-extra');

describe('AndroidFilesCreator', () => {
  let fileRepository = null;
  let androidFilesCreator = null;

  beforeEach(() => {
    fileRepository = {
      hasAccess: (path, permission) => false,
      loadData: (filename, extension) => 'loadData',
      saveData: jest.fn(),
    };
    androidFilesCreator = new AndroidFilesCreator(fileRepository);
  });

  it('does return true if supported type', async () => {
    const result = androidFilesCreator.supports('xml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = androidFilesCreator.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('executes save method once when mergeLanguages is true', () => {
    androidFilesCreator.save(
      { result: { merged: 'data' }, meta: { mergeLanguages: true } },
      '.',
      'test',
      DEFAULT_VERSION,
      'en'
    );

    expect(fileRepository.saveData).toBeCalledWith('data', `test-${DEFAULT_VERSION}`, 'xml', '.');
    expect(fileRepository.saveData.mock.calls.length).toBe(1);
  });

  it('executes save method for every language and base language', () => {
    const translations = [
      { lang: 'pl_pl', content: 'test2' },
      { lang: 'en_US', content: 'test' },
      { lang: 'de', content: 'test3' },
    ];
    androidFilesCreator.save({ result: translations, meta: {} }, '.', 'test', DEFAULT_VERSION, 'en');

    const firstPathName = `./${DEFAULT_VERSION}/values-pl`;
    const secondPathName = `./${DEFAULT_VERSION}/values-en-rUS`;
    const thirdPathName = `./${DEFAULT_VERSION}/values-${translations[2].lang}`;

    expect(fs.mkdirsSync).toBeCalledWith(firstPathName);
    expect(fs.mkdirsSync).toBeCalledWith(secondPathName);
    expect(fs.mkdirsSync).toBeCalledWith(thirdPathName);
    expect(fs.mkdirsSync).toBeCalledWith(`./${DEFAULT_VERSION}/values`);
    expect(fileRepository.saveData).toBeCalledWith(translations[0].content, 'strings', 'xml', firstPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[1].content, 'strings', 'xml', secondPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[2].content, 'strings', 'xml', thirdPathName);
    expect(fileRepository.saveData).toBeCalledWith(
      translations[1].content,
      'strings',
      'xml',
      `./${DEFAULT_VERSION}/values`
    );
  });

  it('executes save method for every language without base language', () => {
    const translations = [
      { lang: 'pl_pl', content: 'test2' },
      { lang: 'en_US', content: 'test' },
      { lang: 'de', content: 'test3' },
    ];
    androidFilesCreator.save({ result: translations }, '.', 'test', DEFAULT_VERSION, 'test2');

    const firstPathName = `./${DEFAULT_VERSION}/values-pl`;
    const secondPathName = `./${DEFAULT_VERSION}/values-en-rUS`;
    const thirdPathName = `./${DEFAULT_VERSION}/values-${translations[2].lang}`;

    expect(fs.mkdirsSync).toBeCalledWith(firstPathName);
    expect(fs.mkdirsSync).toBeCalledWith(secondPathName);
    expect(fs.mkdirsSync).toBeCalledWith(thirdPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[0].content, 'strings', 'xml', firstPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[1].content, 'strings', 'xml', secondPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[2].content, 'strings', 'xml', thirdPathName);
    expect(fileRepository.saveData).toHaveBeenCalledTimes(3);
  });
});
