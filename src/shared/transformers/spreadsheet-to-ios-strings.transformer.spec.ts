import SpreadsheetToIosStringsTransformer from './spreadsheet-to-ios-strings.transformer';
import ITransformer from './transformer';

const spreeadsheetToJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'spreadsheet return'),
};

const jsonToIosStrings: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'ios string return'),
};

const jsonToMaskedJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'json masked return'),
};

describe('SpreadsheetToIosStringsTransformer', () => {
  const spreadsheetToIosStringsTransformer = new SpreadsheetToIosStringsTransformer(
    spreeadsheetToJson,
    jsonToIosStrings,
    jsonToMaskedJson
  );

  it('does return true if supported type', async () => {
    const result = spreadsheetToIosStringsTransformer.supports('strings');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = spreadsheetToIosStringsTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate xml from spreadsheet', async () => {
    const object = { test: ['test'] };
    const langCode = 'en_US';

    spreadsheetToIosStringsTransformer.transform(object, { langCode });

    expect(spreeadsheetToJson.transform).toBeCalledWith(object, { langCode });
    expect(jsonToMaskedJson.transform).toBeCalledWith('spreadsheet return', {});
    expect(jsonToIosStrings.transform).toBeCalledWith('json masked return');
  });

  it('does generate languages object from spreadsheet', async () => {
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(() => ({ en: [{ test: 'test' }], fr: [{ test2: 'test2' }] })),
    };

    const jsonToMaskedJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(json => json),
    };

    const spreadsheetToIosStringsTransformer2 = new SpreadsheetToIosStringsTransformer(
      spreeadsheetToJson2,
      jsonToIosStrings,
      jsonToMaskedJson2
    );
    const object = { '11': ['', 'CORE'] };

    const result = spreadsheetToIosStringsTransformer2.transform(object);

    expect(spreeadsheetToJson2.transform).toBeCalledWith(object, { langCode: undefined });
    expect(jsonToMaskedJson2.transform).toBeCalledWith(
      { en: [{ test: 'test' }], fr: [{ test2: 'test2' }] },
      { filters: undefined }
    );
    expect(jsonToIosStrings.transform).toBeCalledWith([{ test: 'test' }]);
    expect(jsonToIosStrings.transform).toBeCalledWith([{ test2: 'test2' }]);
    expect(result).toEqual([
      { content: 'ios string return', lang: 'en' },
      { content: 'ios string return', lang: 'fr' },
    ]);
  });
  it('does pass filters to json to json transformer', async () => {
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(() => ({ en: [{ test: 'test' }], fr: [{ test2: 'test2' }] })),
    };

    const jsonToMaskedJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(json => json),
    };

    const spreadsheetToIosStringsTransformer2 = new SpreadsheetToIosStringsTransformer(
      spreeadsheetToJson2,
      jsonToIosStrings,
      jsonToMaskedJson2
    );
    const object = { '11': ['', 'CORE'] };
    const filters = ['en.test'];
    const result = spreadsheetToIosStringsTransformer2.transform(object, { filters });

    expect(spreeadsheetToJson2.transform).toBeCalledWith(object, { langCode: undefined });
    expect(jsonToMaskedJson2.transform).toBeCalledWith(
      { en: [{ test: 'test' }], fr: [{ test2: 'test2' }] },
      { filters }
    );
    expect(jsonToIosStrings.transform).toBeCalledWith([{ test: 'test' }]);
    expect(jsonToIosStrings.transform).toBeCalledWith([{ test2: 'test2' }]);
    expect(result).toEqual([
      { content: 'ios string return', lang: 'en' },
      { content: 'ios string return', lang: 'fr' },
    ]);
  });
});
