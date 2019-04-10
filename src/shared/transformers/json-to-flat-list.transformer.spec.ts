import JsonToFlatListTransformer from './json-to-flat-list.transformer';
import ITransformer from './transformer';
import { multiLocaleDataset, singleLocaleDataset } from '../../tests/testData';

describe('JsonToFlatListTransformer', () => {
  const jsonToFlatListTransformer = new JsonToFlatListTransformer();

  it('does return true if supported type', async () => {
    const result = jsonToFlatListTransformer.supports('flat-list');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = jsonToFlatListTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate proper string from json when merging languages', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, mergeLanguages: true },
      translations: multiLocaleDataset.translations,
      result: multiLocaleDataset.translations,
    };

    const result = jsonToFlatListTransformer.transform(object);

    expect(result).toEqual({
      ...object,
      result: {
        merged: [
          { name: 'en_us_core_labels_yes', text: 'yes' },
          { name: 'en_us_core_labels_no', text: 'no' },
          { name: 'en_us_core_labels_save', text: 'save' },
          { name: 'en_us_core_labels_cancel', text: 'cancel' },
          { name: 'pl_pl_core_labels_yes', text: 'tak' },
          { name: 'pl_pl_core_labels_no', text: 'nie' },
          { name: 'pl_pl_core_labels_save', text: 'zapisz' },
        ],
      },
    });
  });
  it('does generate proper string from json with comments, without merging languages', async () => {
    const object = {
      comments: multiLocaleDataset.comments,
      meta: { ...multiLocaleDataset.meta, includeComments: true },
      translations: multiLocaleDataset.translations,
      result: multiLocaleDataset.translations,
    };

    const result = jsonToFlatListTransformer.transform(object);

    expect(result).toEqual({
      ...object,
      result: multiLocaleDataset.flatList.multiLanguageNonMergedWithComments,
    });
  });

  it('does generate proper string from json with comments, when merging languages', async () => {
    const object = {
      comments: multiLocaleDataset.comments,
      meta: { ...multiLocaleDataset.meta, mergeLanguages: true, includeComments: true },
      translations: multiLocaleDataset.translations,
      result: multiLocaleDataset.translations,
    };

    const result = jsonToFlatListTransformer.transform(object);

    expect(result).toEqual({
      ...object,
      result: multiLocaleDataset.flatList.multiLanguageMergedWithComments,
    });
  });

  it('does generate proper string from json with comments when single langCode is forced', async () => {
    const object = {
      comments: singleLocaleDataset.comments,
      meta: { ...singleLocaleDataset.meta, includeComments: true },
      translations: singleLocaleDataset.translations,
      result: singleLocaleDataset.translations,
    };

    const result = jsonToFlatListTransformer.transform(object);

    expect(result).toEqual({
      ...object,
      result: singleLocaleDataset.flatList.singleLanguageWithComments,
    });
  });
});
