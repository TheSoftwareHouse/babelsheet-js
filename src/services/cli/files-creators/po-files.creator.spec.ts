import PoFilesCreator from './po-files.creator';

const VERSION = 'Sheet1';

let fileRepository = null;
let poFilesCreator = null;

describe('PoFilesCreator', () => {
  beforeEach(() => {
    fileRepository = {
      hasAccess: (path, permission) => false,
      loadData: (filename, extension) => 'loadData',
      saveData: jest.fn(),
    };

    poFilesCreator = new PoFilesCreator(fileRepository);
  });

  it('does return true if supported type', async () => {
    const result = poFilesCreator.supports('po');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = poFilesCreator.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('executes save method once when dataToSave is merged', () => {
    poFilesCreator.save(
      { translations: {}, result: { merged: 'data' }, meta: { mergeLanguages: true } },
      '.',
      'test',
      VERSION
    );

    expect(fileRepository.saveData).toBeCalledWith('data', 'test', 'po', '.');
    expect(fileRepository.saveData.mock.calls.length).toBe(1);
  });

  it('executes save method for every language', () => {
    const translations = [
      { lang: 'en', content: 'test' },
      { lang: 'pl', content: 'test2' },
      { lang: 'de', content: 'test3' },
    ];
    poFilesCreator.save({ translations: {}, result: translations, meta: {} }, '.', 'test', VERSION);

    expect(fileRepository.saveData).toBeCalledWith(
      translations[0].content,
      `plugin-${translations[0].lang}`,
      'po',
      '.'
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[1].content,
      `plugin-${translations[1].lang}`,
      'po',
      '.'
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[2].content,
      `plugin-${translations[2].lang}`,
      'po',
      '.'
    );

    expect(fileRepository.saveData).toHaveBeenCalledTimes(3);
  });
});
