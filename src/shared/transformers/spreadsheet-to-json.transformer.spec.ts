import { set } from 'dot-prop-immutable';
import * as mask from 'json-mask';
import SpreadsheetToJsonTransformer from './spreadsheet-to-json.transformer';

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

  it('transforms raw translations to json format', () => {
    const source = {
      '0': [],
      '1': ['This is an example spreadsheet for tshio/babelsheet'],
      '2': [],
      '3': ['First rows are not parsed - you can use it as a place for instructions for your colaborators'],
      '4': [],
      '5': ['The tool will start parsing from the row 11 (as the key levels markers indicate)'],
      '6': [],
      '7': [
        'Tags (optional)',
        'First level:',
        'Second level:',
        'Third level:',
        'Fourth level:',
        'locale code',
        'locale code',
      ],
      '8': ['', 'Section names'],
      '9': [],
      '10': ['###', '>>>', '>>>', '>>>', '>>>', 'en_US', 'pl_PL'],
      '11': ['', 'CORE'],
      '12': ['', '', 'LABELS'],
      '13': ['', '', '', 'YES', '', 'yes', 'tak'],
      '14': ['', '', '', 'NO', '', 'no', 'nie'],
      '15': ['', '', '', 'SAVE', '', 'save', 'zapisz'],
      '16': ['', '', '', 'CANCEL', '', 'cancel'],
      '17': ['', 'COMMON'],
      '18': ['tag1, tag2', '', 'STH1', '', '', 'Some message ...', 'Jakaś wiadomość ...'],
      '19': ['', '', 'FORM'],
      '20': ['', '', '', 'COMMENT', '', 'comment', 'komentarz'],
      '21': ['', 'FRONT'],
      '22': ['', '', 'HEADER'],
      '23': ['', '', '', 'TITLE', '', 'My Cool App', 'Moja Apka'],
      '24': ['', '', '', 'CATCH_PHRASE', '', 'Join us!', 'Dołącz do nas!'],
      '25': ['', '', 'PAGINATION'],
      '26': ['tag1, tag2', '', '', 'FIRST', '', 'First page', 'Pierwsza strona'],
      '27': ['tag1, tag2', '', '', 'NEXT', '', 'Next page', 'Następna strona'],
      '28': ['tag1', '', '', 'PREV', '', 'Prev page', 'Poprzednia strona'],
      '29': ['tag1', '', '', 'LAST', '', 'Last page', 'Ostatnia strona'],
      '30': ['', 'BACK'],
      '31': ['', '', 'MAILS'],
      '32': ['', '', '', 'REGISTER'],
      '33': ['', '', '', '', 'SUBJECT', 'You have been registered', 'Zarejestrowałeś się.'],
      '34': ['', '', '', '', 'GREETING', 'Hi %name%', 'Cześć %name%'],
      '35': ['', '', '', '', 'LINE1', 'Thank you for signing up with us.', 'Dziękujemy za rejestrację'],
      '36': ['tag2', '', '', '', 'FOOTER', 'The App Team', 'Ekipa Apki'],
    };

    const expectedResult = {
      tags: {
        tag1: {
          COMMON: {
            STH1: null,
          },
          FRONT: {
            PAGINATION: {
              FIRST: null,
              NEXT: null,
              PREV: null,
              LAST: null,
            },
          },
        },
        tag2: {
          COMMON: {
            STH1: null,
          },
          FRONT: {
            PAGINATION: {
              FIRST: null,
              NEXT: null,
            },
          },
          BACK: { MAILS: { REGISTER: { FOOTER: null } } },
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
        COMMON: {
          STH1: 'Some message ...',
          FORM: {
            COMMENT: 'comment',
          },
        },
        FRONT: {
          HEADER: {
            TITLE: 'My Cool App',
            CATCH_PHRASE: 'Join us!',
          },
          PAGINATION: {
            FIRST: 'First page',
            NEXT: 'Next page',
            PREV: 'Prev page',
            LAST: 'Last page',
          },
        },
        BACK: {
          MAILS: {
            REGISTER: {
              SUBJECT: 'You have been registered',
              GREETING: 'Hi %name%',
              LINE1: 'Thank you for signing up with us.',
              FOOTER: 'The App Team',
            },
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
        COMMON: {
          STH1: 'Jakaś wiadomość ...',
          FORM: {
            COMMENT: 'komentarz',
          },
        },
        FRONT: {
          HEADER: {
            TITLE: 'Moja Apka',
            CATCH_PHRASE: 'Dołącz do nas!',
          },
          PAGINATION: {
            FIRST: 'Pierwsza strona',
            NEXT: 'Następna strona',
            PREV: 'Poprzednia strona',
            LAST: 'Ostatnia strona',
          },
        },
        BACK: {
          MAILS: {
            REGISTER: {
              SUBJECT: 'Zarejestrowałeś się.',
              GREETING: 'Cześć %name%',
              LINE1: 'Dziękujemy za rejestrację',
              FOOTER: 'Ekipa Apki',
            },
          },
        },
      },
    };

    const transformer = new SpreadsheetToJsonTransformer();

    expect(transformer.transform(source)).toEqual(expectedResult);
  });

  it('transforms raw translations to json format when there are more values in rows', () => {
    const source = {
      '10': ['###', '>>>', '>>>', '>>>', '', 'en_US', 'pl_PL'],
      '11': ['', 'CORE'],
      '12': ['', '', 'LABELS'],
      '13': ['', '', '', 'YES', '', 'yes', 'tak', 'moreValues', 'moreValues'],
      '14': ['', '', '', 'NO', '', 'no', 'nie', 'moreValues', 'moreValues'],
      '15': ['', '', '', 'SAVE', '', 'save', 'zapisz', 'moreValues', 'moreValues'],
      '16': ['', '', '', 'CANCEL', '', 'cancel', '', 'moreValues', 'moreValues'],
    };

    const expectedResult = {
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

    const transformer = new SpreadsheetToJsonTransformer();

    expect(transformer.transform(source)).toEqual(expectedResult);
  });

  it('transforms raw translations to json format when there is no meta', () => {
    const source = {
      '11': ['CORE'],
      '12': ['', 'LABELS'],
      '13': ['', '', 'YES', '', 'yes', 'tak', 'moreValues', 'moreValues'],
      '14': ['', '', 'NO', '', 'no', 'nie', 'moreValues', 'moreValues'],
      '15': ['', '', 'SAVE', '', 'save', 'zapisz', 'moreValues', 'moreValues'],
      '16': ['', '', 'CANCEL', '', 'cancel', '', 'moreValues', 'moreValues'],
    };

    const expectedResult = {};

    const transformer = new SpreadsheetToJsonTransformer();

    expect(transformer.transform(source)).toEqual(expectedResult);
  });

  it('transforms raw translations to json format in given language code', () => {
    const langCode = 'pl_PL';
    const source = {
      '10': ['###', '>>>', '>>>', '>>>', '', 'en_US', langCode],
      '11': ['', 'CORE'],
      '12': ['', '', 'LABELS'],
      '13': ['', '', '', 'YES', '', 'yes', 'tak', 'moreValues', 'moreValues'],
      '14': ['', '', '', 'NO', '', 'no', 'nie', 'moreValues', 'moreValues'],
      '15': ['', '', '', 'SAVE', '', 'save', 'zapisz', 'moreValues', 'moreValues'],
      '16': ['', '', '', 'CANCEL', '', 'cancel', '', 'moreValues', 'moreValues'],
    };

    const expectedResult = {
      CORE: {
        LABELS: {
          YES: 'tak',
          NO: 'nie',
          SAVE: 'zapisz',
        },
      },
    };

    const transformer = new SpreadsheetToJsonTransformer();

    expect(transformer.transform(source, { langCode })).toEqual(expectedResult);
  });

  it('does throw exception when there are no translations in given language code', () => {
    const langCode = 'en_US';
    const source = {
      '10': ['###', '>>>', '>>>', '>>>', 'pl_PL'],
      '11': ['', 'CORE'],
      '12': ['', '', 'LABELS'],
      '13': ['', '', '', 'YES', '', 'yes', 'tak', 'moreValues'],
      '14': ['', '', '', 'NO', '', 'no', 'nie', 'moreValues'],
      '15': ['', '', '', 'SAVE', '', 'save', 'zapisz', 'moreValues'],
      '16': ['', '', '', 'CANCEL', '', 'cancel', '', 'moreValues'],
    };

    const transformer = new SpreadsheetToJsonTransformer();

    expect(() => transformer.transform(source, { langCode })).toThrow(
      `No translations for '${langCode}' language code`
    );
  });
});
