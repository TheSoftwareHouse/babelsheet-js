import IosFilesCreator from './ios-files.creator';
import * as fs from 'fs';

jest.mock('fs');

const fileRepository = {
  hasAccess: (path, permission) => false,
  loadData: (filename, extension) => 'loadData',
  saveData: jest.fn(),
};

describe('FileCreators', () => {
  const iosFilesCreator = new IosFilesCreator(fileRepository);

  it('does return true if supported type', async () => {
    const result = iosFilesCreator.supports('strings');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = iosFilesCreator.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('executes save method once when dataToSave is string', () => {
    iosFilesCreator.save('data', '.', 'test');

    expect(fileRepository.saveData).toBeCalledWith('data', 'test', 'strings', '.');
    expect(fileRepository.saveData.mock.calls.length).toBe(1);
  });

  it('executes save method for every language', () => {
    const translations = [
      { lang: 'en', content: 'test' },
      { lang: 'pl', content: 'test2' },
      { lang: 'de', content: 'test3' },
    ];
    iosFilesCreator.save(translations, '.', 'test');

    expect(fs.mkdirSync).toBeCalledWith(`./${translations[0].lang}.lproj`);
    expect(fs.mkdirSync).toBeCalledWith(`./${translations[1].lang}.lproj`);
    expect(fs.mkdirSync).toBeCalledWith(`./${translations[2].lang}.lproj`);
    expect(fileRepository.saveData).toBeCalledWith(
      translations[0].content,
      'Localizable',
      'strings',
      `./${translations[0].lang}.lproj`
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[1].content,
      'Localizable',
      'strings',
      `./${translations[1].lang}.lproj`
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[2].content,
      'Localizable',
      'strings',
      `./${translations[2].lang}.lproj`
    );
  });
});
