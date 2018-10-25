import * as fs from 'fs-extra';
import AndroidFilesCreator from './android-files.creator';

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
    androidFilesCreator.save({ result: { merged: 'data' }, meta: { mergeLanguages: true } }, '.', 'test', 'en');

    expect(fileRepository.saveData).toBeCalledWith('data', 'test', 'xml', '.');
    expect(fileRepository.saveData.mock.calls.length).toBe(1);
  });

  it('executes save method for every language and base language', () => {
    const translations = [
      { lang: 'pl_pl', content: 'test2' },
      { lang: 'en_US', content: 'test' },
      { lang: 'de', content: 'test3' },
    ];
    androidFilesCreator.save({ result: translations, meta: {} }, '.', 'test', 'en');

    const firstPathName = './values-pl';
    const secondPathName = './values-en-rUS';
    const thirdPathName = `./values-${translations[2].lang}`;

    expect(fs.mkdirsSync).toBeCalledWith(firstPathName);
    expect(fs.mkdirsSync).toBeCalledWith(secondPathName);
    expect(fs.mkdirsSync).toBeCalledWith(thirdPathName);
    expect(fs.mkdirsSync).toBeCalledWith('./values');
    expect(fileRepository.saveData).toBeCalledWith(translations[0].content, 'strings', 'xml', firstPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[1].content, 'strings', 'xml', secondPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[2].content, 'strings', 'xml', thirdPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[1].content, 'strings', 'xml', './values');
  });

  it('executes save method for every language without base language', () => {
    const translations = [
      { lang: 'pl_pl', content: 'test2' },
      { lang: 'en_US', content: 'test' },
      { lang: 'de', content: 'test3' },
    ];
    androidFilesCreator.save({ result: translations }, '.', 'test', 'test2');

    const firstPathName = './values-pl';
    const secondPathName = './values-en-rUS';
    const thirdPathName = `./values-${translations[2].lang}`;

    expect(fs.mkdirsSync).toBeCalledWith(firstPathName);
    expect(fs.mkdirsSync).toBeCalledWith(secondPathName);
    expect(fs.mkdirsSync).toBeCalledWith(thirdPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[0].content, 'strings', 'xml', firstPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[1].content, 'strings', 'xml', secondPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[2].content, 'strings', 'xml', thirdPathName);
    expect(fileRepository.saveData).toHaveBeenCalledTimes(3);
  });
});
