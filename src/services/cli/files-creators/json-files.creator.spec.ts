import JsonFilesCreator from './json-files.creator';

const DEFAULT_VERSION = 'Sheet1';

const fileRepository = {
  hasAccess: (path, permission) => false,
  loadData: (filename, extension) => 'loadData',
  saveData: jest.fn(),
};

describe('JsonFilesCreator', () => {
  const jsonFilesCreator = new JsonFilesCreator(fileRepository);

  it('does return true if supported type', async () => {
    const result = jsonFilesCreator.supports('json');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = jsonFilesCreator.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('executes save method once when dataToSave is string', () => {
    jsonFilesCreator.save('data', '.', 'test', DEFAULT_VERSION);

    expect(fileRepository.saveData).toBeCalledWith('data', `test-${DEFAULT_VERSION}`, 'json', '.');
    expect(fileRepository.saveData.mock.calls.length).toBe(1);
  });

  it('executes save method for every language', () => {
    const translations = [
      { lang: 'en', content: 'test' },
      { lang: 'pl', content: 'test2' },
      { lang: 'de', content: 'test3' },
    ];
    jsonFilesCreator.save(translations, '.', 'test', DEFAULT_VERSION);

    expect(fileRepository.saveData).toBeCalledWith(
      translations[0].content,
      `${translations[0].lang}-${DEFAULT_VERSION}`,
      'json',
      '.'
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[1].content,
      `${translations[1].lang}-${DEFAULT_VERSION}`,
      'json',
      '.'
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[2].content,
      `${translations[2].lang}-${DEFAULT_VERSION}`,
      'json',
      '.'
    );
  });
});
