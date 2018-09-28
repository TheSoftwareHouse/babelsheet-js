import SpreadsheetToJsonStringTransformer from './spreadsheet-to-json-string.transformer';
import ITransformer from './transformer';

describe('SpreadsheetToJsonStringTransformer', () => {
  const spreadSheetToJson = {
    supports: type => false,
    transform: jest.fn(source => source),
  };
  const jsonToMaskedJson: ITransformer = {
    supports: type => false,
    transform: jest.fn(source => source),
  }
  
  const spreadsheetToJsonStringTransformer = new SpreadsheetToJsonStringTransformer(spreadSheetToJson,jsonToMaskedJson);

  it('does return true for supported format', async () => {
    const result = spreadsheetToJsonStringTransformer.supports('json');

    expect(result).toBeTruthy();
  });

  it('does return false for not supported format', async () => {
    const result = spreadsheetToJsonStringTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does transform json to string', async () => {
    const result = spreadsheetToJsonStringTransformer.transform({ en: ['test2'] }, 'en');

    expect(result).toBe('{"en":["test2"]}');
  });

  it('does call spreadsheetToJson.transform with two parameters', async () => {
    const translations = { test: ['test2'] };
    const langCode = 'en_US';
    const result = spreadsheetToJsonStringTransformer.transform(translations, langCode);

    expect(spreadSheetToJson.transform).toBeCalledWith(translations, langCode);
  });

  it('does generate languages object from spreadsheet', async () => {
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(() => ({ en: [{ test: 'test' }], fr: [{ test2: 'test2' }] })),
    };
    const jsonToMaskedJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(source => source),
    }

    const spreadsheetToJsonStringTransformer2 = new SpreadsheetToJsonStringTransformer(spreeadsheetToJson2,jsonToMaskedJson2);
    const object = { '11': ['', 'CORE'] };

    const result = spreadsheetToJsonStringTransformer2.transform(object);
    expect(jsonToMaskedJson2.transform).toBeCalledWith({ en: [{ test: 'test' }], fr: [{ test2: 'test2' }] },undefined,undefined,undefined);
    expect(spreeadsheetToJson2.transform).toBeCalledWith(object, undefined);
    expect(result).toEqual([
      { lang: 'en', content: JSON.stringify([{ test: 'test' }]) },
      { lang: 'fr', content: JSON.stringify([{ test2: 'test2' }]) },
    ]);
  });
});
