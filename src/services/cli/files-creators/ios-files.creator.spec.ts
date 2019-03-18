import IosFilesCreator from './ios-files.creator';
import * as fs from 'fs-extra';

const DEFAULT_VERSION = 'Sheet1';

jest.mock('fs-extra');

describe('IosFilesCreator', () => {
  let fileRepository = null;
  let iosFilesCreator = null;

  beforeEach(() => {
    fileRepository = {
      hasAccess: (path, permission) => false,
      loadData: (filename, extension) => 'loadData',
      saveData: jest.fn(),
    };

    iosFilesCreator = new IosFilesCreator(fileRepository);
  });

  it('does return true if supported type', async () => {
    const result = iosFilesCreator.supports('strings');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = iosFilesCreator.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('executes save method once when dataToSave is merged', () => {
    iosFilesCreator.save(
      { result: { merged: 'data' }, meta: { mergeLanguages: true } },
      '.',
      'test',
      DEFAULT_VERSION,
      'en'
    );

    expect(fileRepository.saveData).toBeCalledWith('data', `test-${DEFAULT_VERSION}`, 'strings', '.');
    expect(fileRepository.saveData.mock.calls.length).toBe(1);
  });

  it('executes save method for every language and base language with proper language-region code', () => {
    const translations = [
      { lang: 'pl_pl', content: 'test2' },
      { lang: 'en_US', content: 'test' },
      { lang: 'de', content: 'test3' },
    ];
    iosFilesCreator.save({ result: translations }, '.', 'test', DEFAULT_VERSION, 'en');

    const firstPathName = `./${DEFAULT_VERSION}/pl.lproj`;
    const secondPathName = `./${DEFAULT_VERSION}/en-US.lproj`;
    const thirdPathName = `./${DEFAULT_VERSION}/${translations[2].lang}.lproj`;

    expect(fs.mkdirsSync).toBeCalledWith(firstPathName);
    expect(fs.mkdirsSync).toBeCalledWith(secondPathName);
    expect(fs.mkdirsSync).toBeCalledWith(thirdPathName);
    expect(fs.mkdirsSync).toBeCalledWith(`./${DEFAULT_VERSION}/Base.lproj`);
    expect(fileRepository.saveData).toBeCalledWith(translations[0].content, 'Localizable', 'strings', firstPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[1].content, 'Localizable', 'strings', secondPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[2].content, 'Localizable', 'strings', thirdPathName);
    expect(fileRepository.saveData).toBeCalledWith(
      translations[1].content,
      'Localizable',
      'strings',
      `./${DEFAULT_VERSION}/Base.lproj`
    );
  });

  it('executes save method for every language without base language', () => {
    const translations = [
      { lang: 'pl_pl', content: 'test2' },
      { lang: 'fr', content: 'test' },
      { lang: 'de', content: 'test3' },
    ];
    iosFilesCreator.save({ result: translations }, '.', 'test', DEFAULT_VERSION, 'test2');

    const firstPathName = `./${DEFAULT_VERSION}/pl.lproj`;
    const secondPathName = `./${DEFAULT_VERSION}/fr.lproj`;
    const thirdPathName = `./${DEFAULT_VERSION}/${translations[2].lang}.lproj`;

    expect(fs.mkdirsSync).toBeCalledWith(firstPathName);
    expect(fs.mkdirsSync).toBeCalledWith(secondPathName);
    expect(fs.mkdirsSync).toBeCalledWith(thirdPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[0].content, 'Localizable', 'strings', firstPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[1].content, 'Localizable', 'strings', secondPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[2].content, 'Localizable', 'strings', thirdPathName);
    expect(fileRepository.saveData).toHaveBeenCalledTimes(3);
  });
});
