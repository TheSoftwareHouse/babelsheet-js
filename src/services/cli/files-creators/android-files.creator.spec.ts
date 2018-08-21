import * as fs from 'fs';
import AndroidFilesCreator from './android-files.creator';

jest.mock('fs');

const fileRepository = {
  hasAccess: (path, permission) => false,
  loadData: (filename, extension) => 'loadData',
  saveData: jest.fn(),
};

describe('FileCreators', () => {
  const androidFilesCreator = new AndroidFilesCreator(fileRepository);

  it('does return true if supported type', async () => {
    const result = androidFilesCreator.supports('xml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = androidFilesCreator.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('executes save method once when dataToSave is string', () => {
    androidFilesCreator.save('data', '.', 'test');

    expect(fileRepository.saveData).toBeCalledWith('data', 'test', 'xml', '.');
    expect(fileRepository.saveData.mock.calls.length).toBe(1);
  });

  it('executes save method for every language', () => {
    const translations = [
      { lang: 'pl_pl', content: 'test2' },
      { lang: 'en_US', content: 'test' },
      { lang: 'de', content: 'test3' },
    ];
    androidFilesCreator.save(translations, '.', 'test');

    const firstPathName = './values-pl';
    const secondPathName = './values-en-rUS';
    const thirdPathName = `./values-${translations[2].lang}`;

    expect(fs.mkdirSync).toBeCalledWith(firstPathName);
    expect(fs.mkdirSync).toBeCalledWith(secondPathName);
    expect(fs.mkdirSync).toBeCalledWith(thirdPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[0].content, 'strings', 'xml', firstPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[1].content, 'strings', 'xml', secondPathName);
    expect(fileRepository.saveData).toBeCalledWith(translations[2].content, 'strings', 'xml', thirdPathName);
  });
});
