import SpreadsheetToXmlTransformer from './spreadsheet-to-xml.transformer';
import ITransformer from '../../shared/transformers/transformer';
import { minimalPassingObject } from '../../tests/testData';

const spreeadsheetToJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(source => ({ ...source, result: 'spreadsheet return' })),
};

const jsonToXml: ITransformer = {
  supports: type => false,
  transform: jest.fn(source => ({ ...source, result: 'xml return' })),
};

const jsonToMaskedJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(source => ({ ...source, result: 'json masked return' })),
};

describe('SpreadsheetToXmlTransformer', () => {
  const spreadsheetToXmlTransformer = new SpreadsheetToXmlTransformer(spreeadsheetToJson, jsonToXml, jsonToMaskedJson);

  it('does return true if supported type', async () => {
    const result = spreadsheetToXmlTransformer.supports('xml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = spreadsheetToXmlTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate object for given language from spreadsheet', async () => {
    const object = { ...minimalPassingObject };

    const result = spreadsheetToXmlTransformer.transform(object);
  });

  it('does generate languages object from spreadsheet', async () => {
    const object = { ...minimalPassingObject };

    const result = spreadsheetToXmlTransformer.transform(object);

    expect(spreeadsheetToJson.transform).toBeCalledWith(object);
    expect(jsonToMaskedJson.transform).toBeCalledWith({ ...object, result: 'spreadsheet return' });
    expect(jsonToXml.transform).toBeCalledWith({ ...object, result: 'json masked return' });
    expect(result).toEqual({ ...object, result: 'xml return' });
  });
});
