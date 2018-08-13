import JsonToJsonTransformer from './json-to-json.transformer';

describe('JsonToJsonTransformer', () => {
  const jsonToJsonTransformer = new JsonToJsonTransformer();

  it('does return true if supported type', async () => {
    const result = jsonToJsonTransformer.supports('json');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = jsonToJsonTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate ios strings from json', async () => {
    const object = { test: ['test'] };

    const result = jsonToJsonTransformer.transform(object);

    expect(result).toBe(object);
  });
});
