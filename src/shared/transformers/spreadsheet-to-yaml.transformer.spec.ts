import SpreadsheetToYamlTransformer from './spreadsheet-to-yaml.transformer';
import ITransformer from '../../shared/transformers/transformer';

const spreadsheetToJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'spreadsheet return'),
};

const jsonToYaml: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'yaml return'),
};

describe('SpreadsheetToYamlTransformer', () => {
  const spreadsheetToYamlTransformer = new SpreadsheetToYamlTransformer(spreadsheetToJson, jsonToYaml);

  it('does return true if supported type', async () => {
    const result = spreadsheetToYamlTransformer.supports('yaml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = spreadsheetToYamlTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate object for given language from spreadsheet', async () => {
    const object = { test: ['test'] };
    const langCode = 'en_US';

    spreadsheetToYamlTransformer.transform(object, langCode);

    expect(spreadsheetToJson.transform).toBeCalledWith(object, langCode);
    expect(jsonToYaml.transform).toBeCalledWith('spreadsheet return');
  });

  it('does generate languages object from spreadsheet', async () => {
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(() => ({ en: [{ test: 'test' }], fr: [{ test2: 'test2' }] })),
    };

    const spreadsheetToYamlTransformer2 = new SpreadsheetToYamlTransformer(spreeadsheetToJson2, jsonToYaml);
    const object = { '11': ['', 'CORE'] };

    const result = spreadsheetToYamlTransformer2.transform(object);

    expect(spreeadsheetToJson2.transform).toBeCalledWith(object, undefined);
    expect(jsonToYaml.transform).toBeCalledWith('spreadsheet return');
    expect(result).toEqual([{ content: 'yaml return', lang: 'en' }, { content: 'yaml return', lang: 'fr' }]);
  });
});
