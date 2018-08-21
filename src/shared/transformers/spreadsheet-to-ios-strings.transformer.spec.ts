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

describe('SpreadsheetToIosStringsTransformer', () => {
  const spreadsheetToIosStringsTransformer = new SpreadsheetToIosStringsTransformer(
    spreeadsheetToJson,
    jsonToIosStrings
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

    spreadsheetToIosStringsTransformer.transform(object, langCode);

    expect(spreeadsheetToJson.transform).toBeCalledWith(object, langCode);
    expect(jsonToIosStrings.transform).toBeCalledWith('spreadsheet return');
  });

  it('does generate languages object from spreadsheet', async () => {
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(() => ({ en: [{ test: 'test' }], fr: [{ test2: 'test2' }] })),
    };

    const spreadsheetToIosStringsTransformer2 = new SpreadsheetToIosStringsTransformer(
      spreeadsheetToJson2,
      jsonToIosStrings
    );
    const object = { '11': ['', 'CORE'] };

    const result = spreadsheetToIosStringsTransformer2.transform(object);

    expect(spreeadsheetToJson2.transform).toBeCalledWith(object, undefined);
    expect(jsonToIosStrings.transform).toBeCalledWith('spreadsheet return');
    expect(result).toEqual([
      { content: 'ios string return', lang: 'en' },
      { content: 'ios string return', lang: 'fr' },
    ]);
  });
});
