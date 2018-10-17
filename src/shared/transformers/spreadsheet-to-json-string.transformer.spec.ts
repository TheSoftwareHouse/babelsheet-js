import SpreadsheetToJsonStringTransformer from './spreadsheet-to-json-string.transformer';
import ITransformer from './transformer';
import { minimalPassingObject } from '../../tests/testData';

describe('SpreadsheetToJsonStringTransformer', () => {
  const spreadSheetToJson = {
    supports: type => false,
    transform: jest.fn(source => source),
  };
  const jsonToMaskedJson: ITransformer = {
    supports: type => false,
    transform: jest.fn(source => source),
  };

  const spreadsheetToJsonStringTransformer = new SpreadsheetToJsonStringTransformer(
    spreadSheetToJson,
    jsonToMaskedJson
  );

  it('does return true for supported format', async () => {
    const result = spreadsheetToJsonStringTransformer.supports('json');

    expect(result).toBeTruthy();
  });

  it('does return false for not supported format', async () => {
    const result = spreadsheetToJsonStringTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does transform json to string', async () => {
    const object = {
      ...minimalPassingObject,
      meta: {
        ...minimalPassingObject.meta,
        mergeLanguages: true,
      },
    };

    const result = spreadsheetToJsonStringTransformer.transform(object);

    expect(result).toEqual({ ...object, result: JSON.stringify(minimalPassingObject.result) });
  });

  it('does pass the source through the transformers', async () => {
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      // transform: jest.fn(() => ({ en: [{ test: 'test' }], fr: [{ test2: 'test2' }] })),
      transform: jest.fn(source => ({ ...source, result: { en: { test: 'test' }, fr: { test2: 'test2' } } })),
    };

    const jsonToMaskedJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(source => source),
    };

    const spreadsheetToJsonStringTransformer2 = new SpreadsheetToJsonStringTransformer(
      spreeadsheetToJson2,
      jsonToMaskedJson2
    );

    const object = {
      ...minimalPassingObject,
    };

    const result = spreadsheetToJsonStringTransformer2.transform(object);
    expect(spreeadsheetToJson2.transform).toBeCalledWith(object);
    expect(jsonToMaskedJson2.transform).toBeCalledWith({
      ...object,
      result: { en: { test: 'test' }, fr: { test2: 'test2' } },
    });
    expect(result).toEqual({
      ...object,
      result: [
        { lang: 'en', content: JSON.stringify({ test: 'test' }) },
        { lang: 'fr', content: JSON.stringify({ test2: 'test2' }) },
      ],
    });
  });

  it('does transform json to string, with multiple keys', async () => {
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(source => ({ ...source, result: { en: [{ test: 'test' }], fr: [{ test2: 'test2' }] } })),
    };

    const jsonToMaskedJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(source => source),
    };

    const spreadsheetToJsonStringTransformer2 = new SpreadsheetToJsonStringTransformer(
      spreeadsheetToJson2,
      jsonToMaskedJson2
    );

    const object = {
      ...minimalPassingObject,
    };

    const result = spreadsheetToJsonStringTransformer2.transform(object);
    expect(spreeadsheetToJson2.transform).toBeCalledWith(object);
    expect(jsonToMaskedJson2.transform).toBeCalledWith({
      ...object,
      result: { en: [{ test: 'test' }], fr: [{ test2: 'test2' }] },
    });
    expect(result).toEqual({
      ...object,
      result: [
        { lang: 'en', content: JSON.stringify([{ test: 'test' }]) },
        { lang: 'fr', content: JSON.stringify([{ test2: 'test2' }]) },
      ],
    });
  });

  it('does transform json to string when merging languages', async () => {
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      // transform: jest.fn(() => ({ en: [{ test: 'test' }], fr: [{ test2: 'test2' }] })),
      transform: jest.fn(source => ({ ...source, result: { en: { test: 'test' }, fr: { test2: 'test2' } } })),
    };

    const jsonToMaskedJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(source => source),
    };

    const spreadsheetToJsonStringTransformer2 = new SpreadsheetToJsonStringTransformer(
      spreeadsheetToJson2,
      jsonToMaskedJson2
    );

    const object = {
      ...minimalPassingObject,
      meta: { ...minimalPassingObject.meta, mergeLanguages: true },
    };

    const result = spreadsheetToJsonStringTransformer2.transform(object);
    expect(spreeadsheetToJson2.transform).toBeCalledWith(object);
    expect(jsonToMaskedJson2.transform).toBeCalledWith({
      ...object,
      result: { en: { test: 'test' }, fr: { test2: 'test2' } },
    });
    expect(result).toEqual({ ...object, result: JSON.stringify({ en: { test: 'test' }, fr: { test2: 'test2' } }) });
  });

  it('does transform json to string when selecting single locale', async () => {
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(source => ({ ...source, result: { en: { test: 'test' } } })),
    };

    const jsonToMaskedJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(source => source),
    };

    const spreadsheetToJsonStringTransformer2 = new SpreadsheetToJsonStringTransformer(
      spreeadsheetToJson2,
      jsonToMaskedJson2
    );

    const object = {
      ...minimalPassingObject,
      meta: { ...minimalPassingObject.meta, mergeLanguages: true },
    };

    const result = spreadsheetToJsonStringTransformer2.transform(object);
    expect(spreeadsheetToJson2.transform).toBeCalledWith(object);
    expect(jsonToMaskedJson2.transform).toBeCalledWith({ ...object, result: { en: { test: 'test' } } });
    expect(result).toEqual({ ...object, result: JSON.stringify({ en: { test: 'test' } }) });
  });
});
