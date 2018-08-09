import SpreadsheetToXmlTransformer from './spreadsheet-to-xml.transformer';
import ITransformer from '../../shared/transformers/transformer';

const spreeadsheetToJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'spreadsheetReturn'),
};

const jsonToXml: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'json return'),
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

  it('does generate xml from spreadsheet', async () => {
    const object = { test: ['test'] };

    spreadsheetToXmlTransformer.transform(object);

    expect(spreeadsheetToJson.transform).toBeCalledWith(object);
    expect(jsonToXml.transform).toBeCalledWith('spreadsheetReturn');
  });
});
