import YamlFilesCreator from './yaml-files.creator';

describe('YamlFilesCreator', () => {
  let fileRepository = null;
  let yamlFilesCreator = null;

  beforeEach(() => {
    fileRepository = {
      hasAccess: (path, permission) => false,
      loadData: (filename, extension) => 'loadData',
      saveData: jest.fn(),
    };

    yamlFilesCreator = new YamlFilesCreator(fileRepository);
  });

  it('does return true if supported type', async () => {
    const result = yamlFilesCreator.supports('yaml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = yamlFilesCreator.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('executes save method once when dataToSave is string', () => {
    yamlFilesCreator.save('data', '.', 'test');

    expect(fileRepository.saveData).toBeCalledWith('data', 'test', 'yaml', '.');
    expect(fileRepository.saveData.mock.calls.length).toBe(1);
  });

  it('executes save method for every language', () => {
    const translations = [
      { lang: 'pl_pl', content: 'test' },
      { lang: 'en_US', content: 'test2' },
      { lang: 'de', content: 'test3' },
    ];
    yamlFilesCreator.save(translations, '.', 'test');

    expect(fileRepository.saveData).toBeCalledWith(
      translations[0].content,
      `messages.${translations[0].lang}`,
      'yaml',
      '.'
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[1].content,
      `messages.${translations[1].lang}`,
      'yaml',
      '.'
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[2].content,
      `messages.${translations[2].lang}`,
      'yaml',
      '.'
    );
    expect(fileRepository.saveData).toHaveBeenCalledTimes(3);
  });
});
