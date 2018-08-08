import Transformers from './transformers';

const toJsonTransformer = {
  transform: source => 'test',
  supports: type => type === 'json',
};

describe('Transformers', () => {
  const transformersList = [toJsonTransformer];
  const transformers = new Transformers(transformersList);
  const spreadsheetData = { test: ['test2'] };

  it('executes transform method on proper transformer', async () => {
    const result = await transformers.transform(spreadsheetData, 'json');

    expect(result).toBe('test');
  });

  it('throws exception when there is no transformer', async () => {
    const type = 'xyz';

    await expect(transformers.transform(spreadsheetData, type)).rejects.toMatchObject(
      new Error(`No support for ${type} data type`)
    );
  });
});
