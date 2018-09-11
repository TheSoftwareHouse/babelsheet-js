import SpreadsheetToXlfTransformer from './spreadsheet-to-xlf.transformer';
import ITransformer from '../../shared/transformers/transformer';

const spreeadsheetToJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'spreadsheet return'),
};

const jsonToXlf: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'xlf return'),
};

describe('SpreadsheetToXlfTransformer', () => {
  const spreadsheetToXlfTransformer = new SpreadsheetToXlfTransformer(spreeadsheetToJson, jsonToXlf);

  it('does return true if supported type', async () => {
    const result = spreadsheetToXlfTransformer.supports('xlf');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = spreadsheetToXlfTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate languages object in xlf from spreadsheet', async () => {
    const jsonReturned = { en: [{ test: 'test' }], fr: [{ test2: 'test2' }] };
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(() => jsonReturned),
    };

    const spreadsheetToXlfTransformer2 = new SpreadsheetToXlfTransformer(spreeadsheetToJson2, jsonToXlf);
    const object = { '11': ['', 'CORE'] };

    const result = spreadsheetToXlfTransformer2.transform(object);

    expect(spreeadsheetToJson2.transform).toBeCalledWith(object);
    expect(jsonToXlf.transform).toBeCalledWith(jsonReturned['en']);
    expect(jsonToXlf.transform).toBeCalledWith(jsonReturned['fr']);
    expect(result).toEqual([{ content: 'xlf return', lang: 'en' }, { content: 'xlf return', lang: 'fr' }]);
  });
});
