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
      { lang: 'en', content: 'test' },
      { lang: 'pl', content: 'test2' },
      { lang: 'de', content: 'test3' },
    ];
    androidFilesCreator.save(translations, '.', 'test');

    expect(fs.mkdirSync).toBeCalledWith(`./values-${translations[2].lang}`);
    expect(fs.mkdirSync).toBeCalledWith(`./values-${translations[2].lang}`);
    expect(fs.mkdirSync).toBeCalledWith(`./values-${translations[2].lang}`);
    expect(fileRepository.saveData).toBeCalledWith(
      translations[0].content,
      'strings',
      'xml',
      `./values-${translations[0].lang}`
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[1].content,
      'strings',
      'xml',
      `./values-${translations[1].lang}`
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[2].content,
      'strings',
      'xml',
      `./values-${translations[2].lang}`
    );
  });
});
