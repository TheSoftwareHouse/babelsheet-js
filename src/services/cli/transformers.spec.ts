import Transformers from './transformers';
//import SpreadsheetToJsonTransformer from '../../shared/transformers/to-json.transformer';

const toJsonTransformer = {
  transform: source => 'test',
  supports: type => type === 'json',
};

describe('Transformers', () => {
  let transformersList = [toJsonTransformer];
  let transformers = new Transformers(transformersList);
  const spreadsheetData = { test: ['test2'] };

  it('executes transform method on proper transformer', async () => {
    const result = await transformers.transform(spreadsheetData, 'json');

    expect(result).toBe('test');
  });

  it('throw exception when no transformer', async () => {
    const type = 'xyz';

    async function test2() {
      await transformers.transform(spreadsheetData, type);
    }

    await expect(transformers.transform(spreadsheetData, type)).rejects.toMatchObject(
      new Error(`No support for ${type} data type`)
    );
  });
});
