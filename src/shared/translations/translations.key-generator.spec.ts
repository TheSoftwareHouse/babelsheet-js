import TranslationsKeyGenerator from './translations.key-generator';

describe('getExtension', () => {
  it('does return proper key for given filters', () => {
    const translationsKeyGenerator = new TranslationsKeyGenerator();

    const result = translationsKeyGenerator.generateKey('x', ['test', 'test2', 'test3'], 'version', 'extension-xml');

    expect(result).toBe('x-test,test2,test3-extension-xml-version');
  });
});
