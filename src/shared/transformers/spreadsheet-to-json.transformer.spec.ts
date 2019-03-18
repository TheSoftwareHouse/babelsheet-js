import { set } from 'dot-prop-immutable';
import * as mask from 'json-mask';
import SpreadsheetToJsonTransformer from './spreadsheet-to-json.transformer';
import { spreadsheetData } from '../../tests/testData';

describe('SpreadsheetToJsonTransformer', () => {
  it('does return true if supported type', async () => {
    const transformer = new SpreadsheetToJsonTransformer();
    const result = transformer.supports('json-obj');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const transformer = new SpreadsheetToJsonTransformer();
    const result = transformer.supports('xyz');

    expect(result).toBeFalsy();
  });
  it('transforms raw translations with comments and tags to json format', async () => {
    const source = {
      translations: {},
      result: spreadsheetData.multiRawSpreadsheetData['version'],
      meta: spreadsheetData.initialMeta,
    };

    const expectedResult = {
      translations: spreadsheetData.multiTranslationsData,
      result: spreadsheetData.multiTranslationsData,
      comments: spreadsheetData.comments,
      meta: spreadsheetData.meta,
      tags: spreadsheetData.tags,
    };
    const transformer = new SpreadsheetToJsonTransformer();
    const result = await transformer.transform(source);
    expect(result).toEqual(expectedResult);
  });

  it('transforms raw translations with tags to json format', () => {
    const source = {
      translations: {},
      result: spreadsheetData.multiRawSpreadsheetDataWithTags['version'],
      meta: spreadsheetData.initialMeta,
    };

    const expectedResult = {
      translations: spreadsheetData.multiTranslationsData,
      result: spreadsheetData.multiTranslationsData,
      meta: spreadsheetData.meta,
      tags: spreadsheetData.tags,
    };

    const transformer = new SpreadsheetToJsonTransformer();

    expect(transformer.transform(source)).toEqual(expectedResult);
  });

  it('transforms raw translations to json format when there are more values in rows', () => {
    const source = {
      translations: {},
      result: [
        ['###', '>>>', '>>>', '>>>', '', 'en_US', 'pl_PL'],
        ['', 'CORE'],
        ['', '', 'LABELS'],
        ['', '', '', 'YES', '', 'yes', 'tak', 'moreValues', 'moreValues'],
        ['', '', '', 'NO', '', 'no', 'nie', 'moreValues', 'moreValues'],
        ['', '', '', 'SAVE', '', 'save', 'zapisz', 'moreValues', 'moreValues'],
        ['', '', '', 'CANCEL', '', 'cancel', '', 'moreValues', 'moreValues'],
      ],
      meta: spreadsheetData.initialMeta,
    };
    const translations = {
      en_US: {
        CORE: {
          LABELS: {
            YES: 'yes',
            NO: 'no',
            SAVE: 'save',
            CANCEL: 'cancel',
          },
        },
      },
      pl_PL: {
        CORE: {
          LABELS: {
            YES: 'tak',
            NO: 'nie',
            SAVE: 'zapisz',
          },
        },
      },
    };
    const expectedResult = {
      translations,
      meta: spreadsheetData.meta,
      result: translations,
    };

    const transformer = new SpreadsheetToJsonTransformer();

    expect(transformer.transform(source)).toEqual(expectedResult);
  });

  it('transforms raw translations to json format when there is no meta', () => {
    const source = {
      translations: {},
      result: [
        ['CORE'],
        ['', 'LABELS'],
        ['', '', 'YES', '', 'yes', 'tak', 'moreValues', 'moreValues'],
        ['', '', 'NO', '', 'no', 'nie', 'moreValues', 'moreValues'],
        ['', '', 'SAVE', '', 'save', 'zapisz', 'moreValues', 'moreValues'],
        ['', '', 'CANCEL', '', 'cancel', '', 'moreValues', 'moreValues'],
      ],
      meta: spreadsheetData.initialMeta,
    };

    const expectedResult = {
      translations: {},
      result: {},
      meta: {},
    };

    const transformer = new SpreadsheetToJsonTransformer();

    expect(transformer.transform(source)).toEqual(expectedResult);
  });

  it('transforms raw translations to json format in given language code', () => {
    const langCode = 'pl_PL';
    const source = {
      translations: {},
      result: [
        ['###', '>>>', '>>>', '>>>', '', 'en_US', langCode],
        ['', 'CORE'],
        ['', '', 'LABELS'],
        ['', '', '', 'YES', '', 'yes', 'tak', 'moreValues', 'moreValues'],
        ['', '', '', 'NO', '', 'no', 'nie', 'moreValues', 'moreValues'],
        ['', '', '', 'SAVE', '', 'save', 'zapisz', 'moreValues', 'moreValues'],
        ['', '', '', 'CANCEL', '', 'cancel', '', 'moreValues', 'moreValues'],
      ],
      meta: {
        ...spreadsheetData.initialMeta,
        langCode,
      },
    };
    const translations = {
      [langCode]: {
        CORE: {
          LABELS: {
            YES: 'tak',
            NO: 'nie',
            SAVE: 'zapisz',
          },
        },
      },
      en_US: {
        CORE: {
          LABELS: {
            YES: 'yes',
            NO: 'no',
            SAVE: 'save',
            CANCEL: 'cancel',
          },
        },
      },
    };
    const expectedResult = {
      translations,
      result: {
        CORE: {
          LABELS: {
            YES: 'tak',
            NO: 'nie',
            SAVE: 'zapisz',
          },
        },
      },
      meta: { ...spreadsheetData.meta, langCode },
    };

    const transformer = new SpreadsheetToJsonTransformer();

    expect(transformer.transform(source)).toEqual(expectedResult);
  });

  it('does throw exception when there are no translations in given language code', () => {
    const langCode = 'en_US';
    const source = {
      translations: {},
      result: [
        ['###', '>>>', '>>>', '>>>', 'pl_PL'],
        ['', 'CORE'],
        ['', '', 'LABELS'],
        ['', '', '', 'YES', '', 'yes', 'tak', 'moreValues'],
        ['', '', '', 'NO', '', 'no', 'nie', 'moreValues'],
        ['', '', '', 'SAVE', '', 'save', 'zapisz', 'moreValues'],
        ['', '', '', 'CANCEL', '', 'cancel', '', 'moreValues'],
      ],
      meta: {
        ...spreadsheetData.initialMeta,
        langCode,
      },
    };

    const transformer = new SpreadsheetToJsonTransformer();

    expect(() => transformer.transform(source)).toThrow(`No translations for '${langCode}' language code`);
  });
});
