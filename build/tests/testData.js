"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiLocaleDataset = {
    meta: {
        mergeLanguages: false,
        langCode: undefined,
        keepLocale: false,
        locales: ['en_US', 'pl_PL'],
    },
    // expected output from spreadsheetToJosn transformer with multiple languages
    translations: {
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
    },
    // expected comments output from spreadsheetToJson
    comments: {
        CORE: {
            LABELS: {
                YES: 'Affirmative, give consent',
                NO: 'Negative, refuse consent',
                SAVE: 'Persist, save consent',
            },
        },
    },
    // expected tags output from spreadsheetToJson
    tags: {
        tag1: {
            CORE: {
                LABELS: {
                    YES: null,
                },
            },
        },
        tag2: {
            CORE: {
                LABELS: {
                    NO: null,
                    SAVE: null,
                },
            },
        },
    },
    // expected result from jsonToFlatList transformer with multiple locales
    flatList: {
        multiLanguageMergedWithComments: {
            merged: [
                { name: 'en_us_core_labels_yes', text: 'yes', comment: 'Affirmative, give consent' },
                { name: 'en_us_core_labels_no', text: 'no', comment: 'Negative, refuse consent' },
                { name: 'en_us_core_labels_save', text: 'save', comment: 'Persist, save consent' },
                { name: 'en_us_core_labels_cancel', text: 'cancel' },
                { name: 'pl_pl_core_labels_yes', text: 'tak', comment: 'Affirmative, give consent' },
                { name: 'pl_pl_core_labels_no', text: 'nie', comment: 'Negative, refuse consent' },
                { name: 'pl_pl_core_labels_save', text: 'zapisz', comment: 'Persist, save consent' },
            ],
        },
        multiLanguageMerged: {
            merged: [
                { name: 'en_us_core_labels_yes', text: 'yes' },
                { name: 'en_us_core_labels_no', text: 'no' },
                { name: 'en_us_core_labels_save', text: 'save' },
                { name: 'en_us_core_labels_cancel', text: 'cancel' },
                { name: 'pl_pl_core_labels_yes', text: 'tak' },
                { name: 'pl_pl_core_labels_no', text: 'nie' },
                { name: 'pl_pl_core_labels_save', text: 'zapisz' },
            ],
        },
        multiLanguageNonMergedWithComments: [
            {
                lang: 'en_US',
                content: [
                    { name: 'core_labels_yes', text: 'yes', comment: 'Affirmative, give consent' },
                    { name: 'core_labels_no', text: 'no', comment: 'Negative, refuse consent' },
                    { name: 'core_labels_save', text: 'save', comment: 'Persist, save consent' },
                    { name: 'core_labels_cancel', text: 'cancel' },
                ],
            },
            {
                lang: 'pl_PL',
                content: [
                    { name: 'core_labels_yes', text: 'tak', comment: 'Affirmative, give consent' },
                    { name: 'core_labels_no', text: 'nie', comment: 'Negative, refuse consent' },
                    { name: 'core_labels_save', text: 'zapisz', comment: 'Persist, save consent' },
                ],
            },
        ],
        multiLanguageNonMerged: [
            {
                lang: 'en_US',
                content: [
                    { name: 'core_labels_yes', text: 'yes' },
                    { name: 'core_labels_no', text: 'no' },
                    { name: 'core_labels_save', text: 'save' },
                    { name: 'core_labels_cancel', text: 'cancel' },
                ],
            },
            {
                lang: 'pl_PL',
                content: [
                    { name: 'core_labels_yes', text: 'tak' },
                    { name: 'core_labels_no', text: 'nie' },
                    { name: 'core_labels_save', text: 'zapisz' },
                ],
            },
        ],
    },
    transformed: {
        yml: {
            mergedNoComments: {
                merged: `en_US:
  CORE:
    LABELS:
      'YES': 'yes'
      'NO': 'no'
      SAVE: save
      CANCEL: cancel
pl_PL:
  CORE:
    LABELS:
      'YES': tak
      'NO': nie
      SAVE: zapisz
`,
            },
            withComments: [
                {
                    lang: 'en_US',
                    content: `CORE:
  LABELS:
    'YES': 'yes' #Affirmative, give consent
    'NO': 'no' #Negative, refuse consent
    SAVE: save #Persist, save consent
    CANCEL: cancel
`,
                },
                {
                    lang: 'pl_PL',
                    content: `CORE:
  LABELS:
    'YES': tak #Affirmative, give consent
    'NO': nie #Negative, refuse consent
    SAVE: zapisz #Persist, save consent
`,
                },
            ],
            noComments: [
                {
                    lang: 'en_US',
                    content: `CORE:
  LABELS:
    'YES': 'yes'
    'NO': 'no'
    SAVE: save
    CANCEL: cancel
`,
                },
                {
                    lang: 'pl_PL',
                    content: `CORE:
  LABELS:
    'YES': tak
    'NO': nie
    SAVE: zapisz
`,
                },
            ],
        },
    },
};
exports.singleLocaleDataset = {
    meta: {
        langCode: 'en_US',
        locales: ['en_US'],
    },
    translations: {
        CORE: {
            LABELS: {
                YES: 'yes',
                NO: 'no',
                SAVE: 'save',
                CANCEL: 'cancel',
            },
        },
    },
    comments: {
        CORE: {
            LABELS: {
                YES: 'Affirmative, give consent',
                NO: 'Negative, refuse consent',
                SAVE: 'Persist, save consent',
            },
        },
    },
    transformed: {
        yml: {
            noComments: [
                {
                    lang: 'en_US',
                    content: `CORE:
  LABELS:
    'YES': 'yes'
    'NO': 'no'
    SAVE: save
    CANCEL: cancel
`,
                },
            ],
        },
    },
    flatList: {
        singleLanguage: [
            {
                lang: 'en_US',
                content: [
                    { name: 'core_labels_yes', text: 'yes' },
                    { name: 'core_labels_no', text: 'no' },
                    { name: 'core_labels_save', text: 'save' },
                    { name: 'core_labels_cancel', text: 'cancel' },
                ],
            },
        ],
        singleLanguageWithComments: [
            {
                lang: 'en_US',
                content: [
                    { name: 'core_labels_yes', text: 'yes', comment: 'Affirmative, give consent' },
                    { name: 'core_labels_no', text: 'no', comment: 'Negative, refuse consent' },
                    { name: 'core_labels_save', text: 'save', comment: 'Persist, save consent' },
                    { name: 'core_labels_cancel', text: 'cancel' },
                ],
            },
        ],
    },
};
exports.minimalPassingObject = {
    translations: { en_US: { core: '123', front: '234', back: '345' } },
    result: { en_US: { core: '123', front: '234', back: '345' } },
    tags: {
        tag1: { core: null, front: null },
        tag2: { front: null, back: null },
    },
    meta: { locales: ['en_US'] },
};
exports.spreadsheetData = {
    // expected raw data returned from google sheets with comments and tags
    multiRawSpreadsheetData: [
        [],
        ['This is an example spreadsheet for tshio/babelsheet'],
        [],
        ['First rows are not parsed - you can use it as a place for instructions for your colaborators'],
        [],
        ['The tool will start parsing from the row 11 (as the key levels markers indicate)'],
        [],
        [
            'Comments (optional)',
            'Tags (optional)',
            'First level:',
            'Second level:',
            'Third level:',
            'Fourth level:',
            'locale code',
            'locale code',
        ],
        ['', '', 'Section names'],
        [],
        ['$$$', '###', '>>>', '>>>', '>>>', '>>>', 'en_US', 'pl_PL'],
        ['', '', 'CORE'],
        ['', '', '', 'LABELS'],
        ['Affirmative, give consent', '', '', '', 'YES', '', 'yes', 'tak'],
        ['Negative, refuse consent', '', '', '', 'NO', '', 'no', 'nie'],
        ['Persist, save consent', '', '', '', 'SAVE', '', 'save', 'zapisz'],
        ['', '', '', '', 'CANCEL', '', 'cancel'],
        ['', '', 'COMMON'],
        ['', 'tag1, tag2', '', 'STH1', '', '', 'Some message ...', 'Jakaś wiadomość ...'],
        ['', '', '', 'FORM'],
        ['', '', '', '', 'COMMENT', '', 'comment', 'komentarz'],
        ['', '', 'FRONT'],
        ['', '', '', 'HEADER'],
        ['Main page title', '', '', '', 'TITLE', '', 'My Cool App', 'Moja Apka'],
        ['Phrase on a banner', '', '', '', 'CATCH_PHRASE', '', 'Join us!', 'Dołącz do nas!'],
        ['', '', '', 'PAGINATION'],
        ['', 'tag1, tag2', '', '', 'FIRST', '', 'First page', 'Pierwsza strona'],
        ['', 'tag1, tag2', '', '', 'NEXT', '', 'Next page', 'Następna strona'],
        ['', 'tag1', '', '', 'PREV', '', 'Prev page', 'Poprzednia strona'],
        ['', 'tag1', '', '', 'LAST', '', 'Last page', 'Ostatnia strona'],
        ['', '', 'BACK'],
        ['', '', '', 'MAILS'],
        ['', '', '', '', 'REGISTER'],
        ['', '', '', '', '', 'SUBJECT', 'You have been registered', 'Zarejestrowałeś się.'],
        ['', '', '', '', '', 'GREETING', 'Hi %name%', 'Cześć %name%'],
        ['', '', '', '', '', 'LINE1', 'Thank you for signing up with us.', 'Dziękujemy za rejestrację'],
        ['', 'tag2', '', '', '', 'FOOTER', 'The App Team', 'Ekipa Apki'],
    ],
    // expected raw data returned from google sheets with tags
    multiRawSpreadsheetDataWithTags: [
        [],
        ['This is an example spreadsheet for tshio/babelsheet'],
        [],
        ['First rows are not parsed - you can use it as a place for instructions for your colaborators'],
        [],
        ['The tool will start parsing from the row 11 (as the key levels markers indicate)'],
        [],
        ['Tags (optional)', 'First level:', 'Second level:', 'Third level:', 'Fourth level:', 'locale code', 'locale code'],
        ['', 'Section names'],
        [],
        ['###', '>>>', '>>>', '>>>', '>>>', 'en_US', 'pl_PL'],
        ['', 'CORE'],
        ['', '', 'LABELS'],
        ['', '', '', 'YES', '', 'yes', 'tak'],
        ['', '', '', 'NO', '', 'no', 'nie'],
        ['', '', '', 'SAVE', '', 'save', 'zapisz'],
        ['', '', '', 'CANCEL', '', 'cancel'],
        ['', 'COMMON'],
        ['tag1, tag2', '', 'STH1', '', '', 'Some message ...', 'Jakaś wiadomość ...'],
        ['', '', 'FORM'],
        ['', '', '', 'COMMENT', '', 'comment', 'komentarz'],
        ['', 'FRONT'],
        ['', '', 'HEADER'],
        ['', '', '', 'TITLE', '', 'My Cool App', 'Moja Apka'],
        ['', '', '', 'CATCH_PHRASE', '', 'Join us!', 'Dołącz do nas!'],
        ['', '', 'PAGINATION'],
        ['tag1, tag2', '', '', 'FIRST', '', 'First page', 'Pierwsza strona'],
        ['tag1, tag2', '', '', 'NEXT', '', 'Next page', 'Następna strona'],
        ['tag1', '', '', 'PREV', '', 'Prev page', 'Poprzednia strona'],
        ['tag1', '', '', 'LAST', '', 'Last page', 'Ostatnia strona'],
        ['', 'BACK'],
        ['', '', 'MAILS'],
        ['', '', '', 'REGISTER'],
        ['', '', '', '', 'SUBJECT', 'You have been registered', 'Zarejestrowałeś się.'],
        ['', '', '', '', 'GREETING', 'Hi %name%', 'Cześć %name%'],
        ['', '', '', '', 'LINE1', 'Thank you for signing up with us.', 'Dziękujemy za rejestrację'],
        ['tag2', '', '', '', 'FOOTER', 'The App Team', 'Ekipa Apki'],
    ],
    // expected spreadsheetToJson transformer output (no comments, tags)
    multiTranslationsData: {
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
    },
    result: {
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
    },
    // expected tags from raw data
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
    // expected comments from raw data
    comments: {
        CORE: {
            LABELS: {
                YES: 'Affirmative, give consent',
                NO: 'Negative, refuse consent',
                SAVE: 'Persist, save consent',
            },
        },
        FRONT: {
            HEADER: {
                TITLE: 'Main page title',
                CATCH_PHRASE: 'Phrase on a banner',
            },
        },
    },
    // expected meta passed with spreadsheet
    initialMeta: {
        mergeLanguages: undefined,
        langCode: undefined,
        keepLocale: undefined,
    },
    // expected meta from raw data
    meta: {
        locales: ['en_US', 'pl_PL'],
    },
};
