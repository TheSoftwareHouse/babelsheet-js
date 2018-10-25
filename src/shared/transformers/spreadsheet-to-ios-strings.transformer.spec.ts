import SpreadsheetToIosStringsTransformer from './spreadsheet-to-ios-strings.transformer';
import ITransformer from './transformer';
import { minimalPassingObject } from '../../tests/testData';

const spreeadsheetToJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(source => ({ ...source, result: 'spreadsheet result' })),
};

const jsonToMaskedJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(source => ({ ...source, result: 'json masked result' })),
};
const jsonToIosStrings: ITransformer = {
  supports: type => false,
  transform: jest.fn(source => ({ ...source, result: 'json to ios result' })),
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

  it('does pass source through the transformers', async () => {
    const spreadsheetToIosStringsTransformer2 = new SpreadsheetToIosStringsTransformer(
      spreeadsheetToJson,
      jsonToIosStrings,
      jsonToMaskedJson
    );
    const object = {
      ...minimalPassingObject,
      meta: {
        ...minimalPassingObject.meta,
        filters: ['en.test'],
      },
      result: [['', 'CORE']],
    };

    const result = spreadsheetToIosStringsTransformer2.transform(object);

    expect(spreeadsheetToJson.transform).toBeCalledWith(object);
    expect(jsonToMaskedJson.transform).toBeCalledWith({ ...object, result: 'spreadsheet result' });
    expect(jsonToIosStrings.transform).toBeCalledWith({ ...object, result: 'json masked result' });
    expect(result).toEqual({ ...object, result: 'json to ios result' });
  });
});
