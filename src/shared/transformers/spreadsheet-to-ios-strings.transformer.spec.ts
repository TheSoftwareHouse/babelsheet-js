import SpreadsheetToIosStringsTransformer from './spreadsheet-to-ios-strings.transformer';
import ITransformer from '../../shared/transformers/transformer';

const spreeadsheetToJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'spreadsheet return'),
};

const jsonToFlatList: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'json return'),
};

const flatListToIosStrings: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'flat list return'),
};

describe('SpreadsheetToIosStringsTransformer', () => {
  const spreadsheetToIosStringsTransformer = new SpreadsheetToIosStringsTransformer(
    spreeadsheetToJson,
    jsonToFlatList,
    flatListToIosStrings
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
    expect(jsonToFlatList.transform).toBeCalledWith('spreadsheet return');
    expect(flatListToIosStrings.transform).toBeCalledWith('json return');
  });
});
