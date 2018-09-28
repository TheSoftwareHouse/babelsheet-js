import JsonToJsonMaskedTransformer from './json-to-json-masked.transformer';
import MaskConverter from "../../shared/mask/mask.converter";
import MaskInput from "../../shared/mask/mask.input";

describe('JsonToJsonTransformer', () => {
  const maskInput = new MaskInput();
  const maskConverter = new MaskConverter();
  const jsonToJsonMaskedTransformer = new JsonToJsonMaskedTransformer(maskInput,maskConverter);
  it('does return true if supported type', async () => {
    const result = jsonToJsonMaskedTransformer.supports('json');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = jsonToJsonMaskedTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate masked json from json', async () => {
    const object = {'en':{
      first: {
        filter: 'abc',
      },
      secondfilter: '123',
      deleted: 'not in result',
    }}

    const result = jsonToJsonMaskedTransformer.transform(object,undefined,undefined,['en.first.filter','en.secondfilter']);

    expect(result).toEqual({en: {
      first: {
        filter: 'abc',
      },
      secondfilter: '123',
    }});
  });
});
