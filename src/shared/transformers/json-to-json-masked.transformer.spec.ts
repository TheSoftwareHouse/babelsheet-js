import JsonToJsonMaskedTransformer from './json-to-json-masked.transformer';
import MaskConverter from '../../shared/mask/mask.converter';
import MaskInput from '../../shared/mask/mask.input';
import { multiLocaleDataset } from '../../tests/testData';

describe('JsonToJsonTransformer', () => {
  const maskInput = new MaskInput();
  const maskConverter = new MaskConverter();
  const jsonToJsonMaskedTransformer = new JsonToJsonMaskedTransformer(maskInput, maskConverter);
  it('does return true if supported type', async () => {
    const result = jsonToJsonMaskedTransformer.supports('json');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = jsonToJsonMaskedTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate masked json from json', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, filters: ['en_US.CORE.LABELS.YES', 'pl_PL.CORE.LABELS'] },
      result: multiLocaleDataset.translations,
      translations: multiLocaleDataset.translations,
    };

    const result = jsonToJsonMaskedTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: {
        en_US: {
          CORE: {
            LABELS: {
              YES: 'yes',
            },
          },
        },
        pl_PL: {
          CORE: {
            LABELS: {
              YES: 'tak',
              NO: 'nie',
              SAVE: 'zapisz',
            },
          },
        },
      },
    };
    expect(result).toEqual(expectedObject);
  });
  it('does generate masked json from json with tags in filters', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, filters: ['en_US.tag1.LABELS.YES', 'pl_PL.tag2.CORE.LABELS'] },
      result: multiLocaleDataset.translations,
      translations: multiLocaleDataset.translations,
      tags: multiLocaleDataset.tags,
    };

    const result = jsonToJsonMaskedTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: {
        en_US: {
          CORE: {
            LABELS: {
              YES: 'yes',
            },
          },
        },
        pl_PL: {
          CORE: {
            LABELS: {
              NO: 'nie',
              SAVE: 'zapisz',
            },
          },
        },
      },
    };
    expect(result).toEqual(expectedObject);
  });
  it('does generate masked json from json with tags with no locale in filters', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, filters: ['tag2', 'en_US.CORE.LABELS.YES'] },
      result: multiLocaleDataset.translations,
      translations: multiLocaleDataset.translations,
      tags: multiLocaleDataset.tags,
    };

    const result = jsonToJsonMaskedTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: {
        en_US: {
          CORE: {
            LABELS: {
              YES: 'yes',
              NO: 'no',
              SAVE: 'save',
            },
          },
        },
        pl_PL: {
          CORE: {
            LABELS: {
              NO: 'nie',
              SAVE: 'zapisz',
            },
          },
        },
      },
    };
    expect(result).toEqual(expectedObject);
  });
});
