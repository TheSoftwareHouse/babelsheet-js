import MaskInput from './mask.input';

describe('MaskInput', () => {
  it('converts array of filters to proper mask object', () => {
    const source = [
      'tag1.COMMON.STH1',
      'tag1.FRONT.PAGINATION.FIRST',
      'tag1.FRONT.PAGINATION.NEXT',
      'tag1.FRONT.PAGINATION.PREV',
      'tag1.FRONT.PAGINATION.LAST',
      'tag2.COMMON.STH1',
      'tag2.FRONT.PAGINATION.FIRST',
      'tag2.FRONT.PAGINATION.NEXT',
      'tag2.BACK.MAILS.REGISTER.FOOTER',
    ];

    const expectedResult = {
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
    };

    const converter = new MaskInput();

    expect(converter.convert(source)).toEqual(expectedResult);
  });
});
