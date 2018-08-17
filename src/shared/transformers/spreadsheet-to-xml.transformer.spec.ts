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

describe('SpreadsheetToXmlTransformer', () => {
  const spreadsheetToXmlTransformer = new SpreadsheetToXmlTransformer(spreeadsheetToJson, jsonToXml);

  it('does return true if supported type', async () => {
    const result = spreadsheetToXmlTransformer.supports('xml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = spreadsheetToXmlTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate xml for given language from spreadsheet', async () => {
    const object = { test: ['test'] };
    const langCode = 'en_US';

    spreadsheetToXmlTransformer.transform(object, langCode);

    expect(spreeadsheetToJson.transform).toBeCalledWith(object, langCode);
    expect(jsonToXml.transform).toBeCalledWith('spreadsheet return');
  });

  it('does generate xml object with languages from spreadsheet', async () => {
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(() => ({ en: { test: 'test' } })),
    };
    const spreadsheetToXmlTransformer = new SpreadsheetToXmlTransformer(spreeadsheetToJson2, jsonToXml);
    const object = { test: ['test'] };
    const langCode = 'en_US';

    spreadsheetToXmlTransformer.transform(object);

    expect(spreeadsheetToJson.transform).toBeCalledWith(object, langCode);
    expect(jsonToXml.transform).toBeCalledWith('spreadsheet return');
  });
});
