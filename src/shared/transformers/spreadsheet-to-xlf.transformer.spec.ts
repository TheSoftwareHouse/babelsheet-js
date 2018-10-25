import SpreadsheetToXlfTransformer from './spreadsheet-to-xlf.transformer';
import ITransformer from '../../shared/transformers/transformer';
import { minimalPassingObject } from '../../tests/testData';

const spreeadsheetToJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(source => ({ ...source, result: 'spreadsheet return' })),
};

const jsonToXlf: ITransformer = {
  supports: type => false,
  transform: jest.fn(source => ({ ...source, result: 'xlf return' })),
};

const jsonToMaskedJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(source => ({ ...source, result: 'json masked return' })),
};

describe('SpreadsheetToXlfTransformer', () => {
  const spreadsheetToXlfTransformer = new SpreadsheetToXlfTransformer(spreeadsheetToJson, jsonToXlf, jsonToMaskedJson);

  it('does return true if supported type', async () => {
    const result = spreadsheetToXlfTransformer.supports('xlf');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = spreadsheetToXlfTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate object for given language from spreadsheet', async () => {
    const langCode = 'en_US';

    const object = {
      ...minimalPassingObject,
      meta: {
        ...minimalPassingObject,
        langCode,
      },
    };

    const result = spreadsheetToXlfTransformer.transform(object);
    expect(spreeadsheetToJson.transform).toBeCalledWith(object);
    expect(jsonToMaskedJson.transform).toBeCalledWith({ ...object, result: 'spreadsheet return' });
    expect(jsonToXlf.transform).toBeCalledWith({ ...object, result: 'json masked return' });
    expect(result).toEqual({ ...object, result: 'xlf return' });
  });

  it('does generate languages object in xlf from spreadsheet', async () => {
    const jsonReturned = { en: { test: 'test' }, fr: { test2: 'test2' } };
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(source => ({ ...source, result: jsonReturned })),
    };

    const jsonToMaskedJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(source => source),
    };

    const jsonToXlf2: ITransformer = {
      supports: type => false,
      transform: jest.fn(source => source),
    };

    const spreadsheetToXlfTransformer2 = new SpreadsheetToXlfTransformer(
      spreeadsheetToJson2,
      jsonToXlf2,
      jsonToMaskedJson2
    );

    const object = {
      ...minimalPassingObject,
      meta: {
        ...minimalPassingObject,
      },
    };
    const result = spreadsheetToXlfTransformer2.transform(object);

    expect(spreeadsheetToJson2.transform).toBeCalledWith(object);
    expect(jsonToMaskedJson2.transform).toBeCalledWith({ ...object, result: jsonReturned });
    expect(jsonToXlf2.transform).toBeCalledWith({ ...object, result: jsonReturned });
    expect(result).toEqual({ ...object, result: jsonReturned });
  });
});
