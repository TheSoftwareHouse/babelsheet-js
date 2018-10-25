import XlfFilesCreator from './xlf-files.creator';

const fileRepository = {
  hasAccess: (path, permission) => false,
  loadData: (filename, extension) => 'loadData',
  saveData: jest.fn(),
};

describe('FileCreators', () => {
  const xlfFilesCreator = new XlfFilesCreator(fileRepository);

  it('does return true if supported type', async () => {
    const result = xlfFilesCreator.supports('xlf');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = xlfFilesCreator.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('executes save method once when dataToSave is merged', () => {
    xlfFilesCreator.save({ translations: {}, result: { merged: 'data' }, meta: { mergeLanguages: true } }, '.', 'test');

    expect(fileRepository.saveData).toBeCalledWith('data', 'test', 'xlf', '.');
    expect(fileRepository.saveData.mock.calls.length).toBe(1);
  });

  it('executes save method for every language', () => {
    const translations = [
      { lang: 'en', content: 'test' },
      { lang: 'pl', content: 'test2' },
      { lang: 'de', content: 'test3' },
    ];
    xlfFilesCreator.save({ result: translations, translations: {}, meta: {} }, '.', 'test');

    expect(fileRepository.saveData).toBeCalledWith(
      translations[0].content,
      `messages.${translations[0].lang}`,
      'xlf',
      '.'
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[1].content,
      `messages.${translations[1].lang}`,
      'xlf',
      '.'
    );
    expect(fileRepository.saveData).toBeCalledWith(
      translations[2].content,
      `messages.${translations[2].lang}`,
      'xlf',
      '.'
    );
  });
});
