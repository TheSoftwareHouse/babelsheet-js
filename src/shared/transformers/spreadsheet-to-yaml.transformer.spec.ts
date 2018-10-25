import SpreadsheetToYamlTransformer from './spreadsheet-to-yaml.transformer';
import ITransformer from '../../shared/transformers/transformer';
import { minimalPassingObject } from '../../tests/testData';

const spreadsheetToJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(source => ({ ...source, result: 'spreadsheet return' })),
};

const jsonToYaml: ITransformer = {
  supports: type => false,
  transform: jest.fn(source => ({ ...source, result: 'yaml return' })),
};

const jsonToMaskedJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(source => ({ ...source, result: 'json masked return' })),
};

describe('SpreadsheetToYamlTransformer', () => {
  const spreadsheetToYamlTransformer = new SpreadsheetToYamlTransformer(
    spreadsheetToJson,
    jsonToYaml,
    jsonToMaskedJson
  );

  it('does return true if supported type', async () => {
    const result = spreadsheetToYamlTransformer.supports('yml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = spreadsheetToYamlTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate languages object from spreadsheet', async () => {
    const object = { ...minimalPassingObject };

    const result = spreadsheetToYamlTransformer.transform(object);

    expect(spreadsheetToJson.transform).toBeCalledWith(object);
    expect(jsonToMaskedJson.transform).toBeCalledWith({ ...object, result: 'spreadsheet return' });
    expect(jsonToYaml.transform).toBeCalledWith({ ...object, result: 'json masked return' });
    expect(result).toEqual({ ...object, result: 'yaml return' });
  });
});
