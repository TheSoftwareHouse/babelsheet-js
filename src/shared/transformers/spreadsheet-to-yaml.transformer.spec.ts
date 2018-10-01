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

const jsonToMaskedJson: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'json masked return'),
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

  it('does generate object for given language from spreadsheet', async () => {
    const object = { test: ['test'] };
    const langCode = 'en_US';

    spreadsheetToYamlTransformer.transform(object, { langCode });

    expect(spreadsheetToJson.transform).toBeCalledWith(object, { langCode });
    expect(jsonToMaskedJson.transform).toBeCalledWith('spreadsheet return', { filters: undefined });
    expect(jsonToYaml.transform).toBeCalledWith('json masked return');
  });

  it('does generate languages object from spreadsheet', async () => {
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(() => ({ en: [{ test: 'test' }], fr: [{ test2: 'test2' }] })),
    };

    const jsonToMaskedJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(json => json),
    };

    const spreadsheetToYamlTransformer2 = new SpreadsheetToYamlTransformer(
      spreeadsheetToJson2,
      jsonToYaml,
      jsonToMaskedJson2
    );
    const object = { '11': ['', 'CORE'] };

    const result = spreadsheetToYamlTransformer2.transform(object);

    expect(spreeadsheetToJson2.transform).toBeCalledWith(object, { langCode: undefined });
    expect(jsonToMaskedJson2.transform).toBeCalledWith(
      { en: [{ test: 'test' }], fr: [{ test2: 'test2' }] },
      { filters: undefined }
    );
    expect(jsonToYaml.transform).toBeCalledWith([{ test: 'test' }]);
    expect(jsonToYaml.transform).toBeCalledWith([{ test2: 'test2' }]);
    expect(result).toEqual([{ content: 'yaml return', lang: 'en' }, { content: 'yaml return', lang: 'fr' }]);
  });
  it('does pass filters to json to json transformer', async () => {
    const spreeadsheetToJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(() => ({ en: [{ test: 'test' }], fr: [{ test2: 'test2' }] })),
    };

    const jsonToMaskedJson2: ITransformer = {
      supports: type => false,
      transform: jest.fn(json => json),
    };

    const spreadsheetToYamlTransformer2 = new SpreadsheetToYamlTransformer(
      spreeadsheetToJson2,
      jsonToYaml,
      jsonToMaskedJson2
    );
    const object = { '11': ['', 'CORE'] };
    const filters = ['en.test'];
    const result = spreadsheetToYamlTransformer2.transform(object, { filters });

    expect(spreeadsheetToJson2.transform).toBeCalledWith(object, { langCode: undefined });
    expect(jsonToMaskedJson2.transform).toBeCalledWith(
      { en: [{ test: 'test' }], fr: [{ test2: 'test2' }] },
      { filters }
    );
    expect(jsonToYaml.transform).toBeCalledWith([{ test: 'test' }]);
    expect(jsonToYaml.transform).toBeCalledWith([{ test2: 'test2' }]);
    expect(result).toEqual([{ content: 'yaml return', lang: 'en' }, { content: 'yaml return', lang: 'fr' }]);
  });
});
