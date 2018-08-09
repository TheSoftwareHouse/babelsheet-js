import SpreadsheetToJsonStringTransformer from './spreadsheet-to-json-string.transformer';

describe('SpreadsheetToJsonStringTransformer', () => {
  const spreadSheetToJson = {
    supports: type => false,
    transform: jest.fn(source => source),
  };

  const spreadsheetToJsonStringTransformer = new SpreadsheetToJsonStringTransformer(spreadSheetToJson);

  it('does return true for supported format', async () => {
    const result = spreadsheetToJsonStringTransformer.supports('json');

    expect(result).toBeTruthy();
  });

  it('does return false for not supported format', async () => {
    const result = spreadsheetToJsonStringTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does transform json to string', async () => {
    const result = spreadsheetToJsonStringTransformer.transform({ test: ['test2'] });

    expect(result).toBe('{"test":["test2"]}');
  });

  it('does call spreadsheetToJson.transform with two parameters', async () => {
    const translations = { test: ['test2'] };
    const langCode = 'en_US';
    const result = spreadsheetToJsonStringTransformer.transform(translations, langCode);

    expect(spreadSheetToJson.transform).toBeCalledWith(translations, langCode);
  });
});
