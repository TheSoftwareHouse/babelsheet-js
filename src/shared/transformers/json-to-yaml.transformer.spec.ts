import JsonToYamlTransformer from './json-to-yaml.transformer';

jest.mock('js-yaml', () => ({
  safeDump: jest.fn(),
}));

import { safeDump } from 'js-yaml';

describe('JsonToYamlTransformer', () => {
  const jsonToYamlTransformer = new JsonToYamlTransformer();

  it('does return true if supported type', async () => {
    const result = jsonToYamlTransformer.supports('json-yml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = jsonToYamlTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate yaml from json', async () => {
    const object = { test: ['test'] };

    jsonToYamlTransformer.transform(object);

    expect(safeDump).toBeCalledWith(object);
  });
});
