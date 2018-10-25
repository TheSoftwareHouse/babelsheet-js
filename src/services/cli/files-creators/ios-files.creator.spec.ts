import IosFilesCreator from './ios-files.creator';
import * as fs from 'fs-extra';

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
    iosFilesCreator.save({ result: { merged: 'data' }, meta: { mergeLanguages: true } }, '.', 'test', 'en');

    expect(fileRepository.saveData).toBeCalledWith('data', 'test', 'strings', '.');
    expect(fileRepository.saveData.mock.calls.length).toBe(1);
  });

  it('executes save method for every language and base language with proper language-region code', () => {
    const translations = [
      { lang: 'pl_pl', content: 'test2' },
      { lang: 'en_US', content: 'test' },
      { lang: 'de', content: 'test3' },
    ];
    iosFilesCreator.save({ result: translations }, '.', 'test', 'en');

    const firstPathName = './pl.lproj';
    const secondPathName = './en-US.lproj';
    const thirdPathName = `./${translations[2].lang}.lproj`;

    expect(fs.mkdirsSync).toBeCalledWith(firstPathName);
    expect(fs.mkdirsSync).toBeCalledWith(secondPathName);
    expect(fs.mkdirsSync).toBeCalledWith(thirdPathName);
    expect(fs.mkdirsSync).toBeCalledWith('./Base.lproj');
    expect(fileRepository.saveData).toBeCalledWith(translations[0].content, 'Localizable', 'strings', firstPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[1].content, 'Localizable', 'strings', secondPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[2].content, 'Localizable', 'strings', thirdPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[1].content, 'Localizable', 'strings', './Base.lproj');
  });

  it('executes save method for every language without base language', () => {
    const translations = [
      { lang: 'pl_pl', content: 'test2' },
      { lang: 'fr', content: 'test' },
      { lang: 'de', content: 'test3' },
    ];
    iosFilesCreator.save({ result: translations }, '.', 'test', 'test2');

    const firstPathName = './pl.lproj';
    const secondPathName = './fr.lproj';
    const thirdPathName = `./${translations[2].lang}.lproj`;

    expect(fs.mkdirsSync).toBeCalledWith(firstPathName);
    expect(fs.mkdirsSync).toBeCalledWith(secondPathName);
    expect(fs.mkdirsSync).toBeCalledWith(thirdPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[0].content, 'Localizable', 'strings', firstPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[1].content, 'Localizable', 'strings', secondPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[2].content, 'Localizable', 'strings', thirdPathName);
    expect(fileRepository.saveData).toHaveBeenCalledTimes(3);
  });
});
