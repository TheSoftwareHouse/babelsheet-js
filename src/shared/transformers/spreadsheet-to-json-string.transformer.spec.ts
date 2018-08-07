import SpreadsheetToJsonStringTransformer from './spreadsheet-to-json-string.transformer';

describe('SpreadsheetToJsonStringTransformer', () => {
  let spreadSheetToJson = {
    supports: type => false,
    transform: source => source,
  };

  let spreadsheetToJsonStringTransformer = new SpreadsheetToJsonStringTransformer(spreadSheetToJson);

  it('should return true for supported format', async () => {
    const result = spreadsheetToJsonStringTransformer.supports('json');

    expect(result).toBeTruthy();
  });

  it('should return false for not supported format', async () => {
    const result = spreadsheetToJsonStringTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('should transform json to string', async () => {
    const result = spreadsheetToJsonStringTransformer.transform({ test: ['test2'] });

    expect(result).toBe('{"test":["test2"]}');
  });
});
