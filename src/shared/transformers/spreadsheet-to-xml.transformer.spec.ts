import SpreadsheetToXmlTransformer from './spreadsheet-to-xml.transformer';
import ITransformer from '../../shared/transformers/transformer';

const spreeadsheetToJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'spreadsheet return'),
};

const jsonToXml: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'xml return'),
};

const jsonToMaskedJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'json masked return'),
}

describe('SpreadsheetToXmlTransformer', () => {
  const spreadsheetToXmlTransformer = new SpreadsheetToXmlTransformer(spreeadsheetToJson, jsonToXml,jsonToMaskedJson);

  it('does return true if supported type', async () => {
    const result = spreadsheetToXmlTransformer.supports('xml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = spreadsheetToXmlTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate object for given language from spreadsheet', async () => {
    const object = { test: ['test'] };
    const langCode = 'en_US';

    spreadsheetToXmlTransformer.transform(object, langCode);

    expect(spreeadsheetToJson.transform).toBeCalledWith(object, langCode);
    expect(jsonToMaskedJson.transform).toBeCalledWith('spreadsheet return',undefined,undefined,undefined);
    expect(jsonToXml.transform).toBeCalledWith('json masked return');
  });

  it('does generate languages object from spreadsheet', async () => {
    const jsonReturned = { en: [{ test: 'test' }], fr: [{ test2: 'test2' }] };
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(() => jsonReturned),
    };
    const jsonToMaskedJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(json => json),
    }
    
    const spreadsheetToXmlTransformer2 = new SpreadsheetToXmlTransformer(spreeadsheetToJson2, jsonToXml,jsonToMaskedJson2);
    const object = { '11': ['', 'CORE'] };

    const result = spreadsheetToXmlTransformer2.transform(object);

    expect(spreeadsheetToJson2.transform).toBeCalledWith(object, undefined);
    expect(jsonToMaskedJson2.transform).toBeCalledWith(jsonReturned, undefined, undefined, undefined);    
    expect(jsonToXml.transform).toBeCalledWith(jsonReturned['en']);
    expect(jsonToXml.transform).toBeCalledWith(jsonReturned['fr']);
    expect(result).toEqual([{ content: 'xml return', lang: 'en' }, { content: 'xml return', lang: 'fr' }]);
  });
});
