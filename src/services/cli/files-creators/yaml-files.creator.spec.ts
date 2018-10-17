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
    const result = yamlFilesCreator.supports('yml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = yamlFilesCreator.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('executes save method once when dataToSave is merged', () => {
    yamlFilesCreator.save(
      {
        result: { merged: 'data' },
        translations: {},
        meta: { mergeLanguages: true },
      },
      '.',
      'test'
    );

    expect(fileRepository.saveData).toBeCalledWith('data', 'test', 'yml', '.');
    expect(fileRepository.saveData.mock.calls.length).toBe(1);
  });

  it('executes save method for every language', () => {
    const translations = [
      { lang: 'pl_pl', content: 'test' },
      { lang: 'en_US', content: 'test2' },
      { lang: 'de', content: 'test3' },
    ];
    yamlFilesCreator.save({ result: translations, translations: {}, meta: {} }, '.', 'test');

    expect(fileRepository.saveData).toBeCalledWith(
      translations[0].content,
      `messages.${translations[0].lang}`,
      'yml',
      '.'
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[1].content,
      `messages.${translations[1].lang}`,
      'yml',
      '.'
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[2].content,
      `messages.${translations[2].lang}`,
      'yml',
      '.'
    );
    expect(fileRepository.saveData).toHaveBeenCalledTimes(3);
  });
});
