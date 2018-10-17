import JsonToYamlTransformer from './json-to-yaml.transformer';

import { safeDump } from 'js-yaml';
import { minimalPassingObject, multiLocaleDataset, singleLocaleDataset } from '../../tests/testData';

jest.mock('js-yaml', () => ({
  safeDump: jest.fn(() => 'a result'),
}));

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

  it('does generate xml from json when merging languages', async () => {
    const object = {
      translations: multiLocaleDataset.translations,
      meta: { ...multiLocaleDataset.meta, mergeLanguages: true },
      result: multiLocaleDataset.translations,
    };

    const result = jsonToYamlTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: multiLocaleDataset.transformed.yml.mergedNoComments,
    };
    expect(result).toEqual(expectedObject);
  });

  it('does generate xml from json with multiple languages', async () => {
    const object = {
      translations: multiLocaleDataset.translations,
      meta: { ...multiLocaleDataset.meta },
      result: multiLocaleDataset.translations,
    };

    const result = jsonToYamlTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: multiLocaleDataset.transformed.yml.noComments,
    };
    expect(result).toEqual(expectedObject);
  });

  it('does generate xml from json with single language', async () => {
    const object = {
      translations: singleLocaleDataset.translations,
      meta: singleLocaleDataset.meta,
      result: singleLocaleDataset.translations,
    };

    const result = jsonToYamlTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: singleLocaleDataset.transformed.yml.noComments,
    };
    expect(result).toEqual(expectedObject);
  });

  it('does parse json to yaml with comments in generateYaml function', () => {
    const json = {
      a: {
        b: {
          ba: 1,
        },
        bb: 2,
        bc: 3,
      },
      c: {
        d: 'test',
        e: 'test2',
      },
    };
    const comments = {
      a: {
        b: {
          ba: '1 comment',
        },
      },
      c: {
        d: '2 comment',
      },
    };
    expect(jsonToYamlTransformer.generateYaml(json, comments)).toEqual(
      `a:
  b:
    ba: 1 #1 comment
  bb: 2
  bc: 3
c:
  d: test #2 comment
  e: test2
`
    );
  });
});
