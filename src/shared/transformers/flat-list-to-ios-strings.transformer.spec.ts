import FlatListToIosStringsTransformer from './flat-list-to-ios-strings.transformer';
import { multiLocaleDataset, singleLocaleDataset } from '../../tests/testData';

describe('FlatListToIosStringsTransformer', () => {
  const flatListToXmlTransformer = new FlatListToIosStringsTransformer();

  it('does return true if supported type', async () => {
    const result = flatListToXmlTransformer.supports('flat-list-strings');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = flatListToXmlTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate proper string from merged flat list', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, mergeLanguages: true },
      result: multiLocaleDataset.flatList.multiLanguageMerged,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToXmlTransformer.transform({
      ...object,
      result: multiLocaleDataset.flatList.multiLanguageMerged,
    });

    const expectedObject = {
      ...object,
      result: {
        merged: `"en_us_core_labels_yes" = "yes";
"en_us_core_labels_no" = "no";
"en_us_core_labels_save" = "save";
"en_us_core_labels_cancel" = "cancel";
"pl_pl_core_labels_yes" = "tak";
"pl_pl_core_labels_no" = "nie";
"pl_pl_core_labels_save" = "zapisz";
`,
      },
    };
    expect(result).toMatchObject(expectedObject);
  });

  it('does generate proper string from merged flat list with comments', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, mergeLanguages: true, includeComments: true },
      result: multiLocaleDataset.flatList.multiLanguageMergedWithComments,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToXmlTransformer.transform(object);

    const expectedObject = {
      ...object,
      result: {
        merged: `/* Note = "Affirmative, give consent"; */
"en_us_core_labels_yes" = "yes";
/* Note = "Negative, refuse consent"; */
"en_us_core_labels_no" = "no";
/* Note = "Persist, save consent"; */
"en_us_core_labels_save" = "save";
"en_us_core_labels_cancel" = "cancel";
/* Note = "Affirmative, give consent"; */
"pl_pl_core_labels_yes" = "tak";
/* Note = "Negative, refuse consent"; */
"pl_pl_core_labels_no" = "nie";
/* Note = "Persist, save consent"; */
"pl_pl_core_labels_save" = "zapisz";
`,
      },
    };
    expect(result).toEqual(expectedObject);
  });

  it('does generate proper string from flat list with comments', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, includeComments: true },
      result: multiLocaleDataset.flatList.multiLanguageNonMergedWithComments,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToXmlTransformer.transform(object);

    const expectedObject = {
      ...object,
      result: [
        {
          lang: 'en_US',
          content: `/* Note = "Affirmative, give consent"; */
"core_labels_yes" = "yes";
/* Note = "Negative, refuse consent"; */
"core_labels_no" = "no";
/* Note = "Persist, save consent"; */
"core_labels_save" = "save";
"core_labels_cancel" = "cancel";
`,
        },
        {
          lang: 'pl_PL',
          content: `/* Note = "Affirmative, give consent"; */
"core_labels_yes" = "tak";
/* Note = "Negative, refuse consent"; */
"core_labels_no" = "nie";
/* Note = "Persist, save consent"; */
"core_labels_save" = "zapisz";
`,
        },
      ],
    };

    expect(result).toEqual(expectedObject);
  });

  it('does generate proper string from flat list with single language', async () => {
    const object = {
      meta: { ...singleLocaleDataset.meta, includeComments: true },
      result: singleLocaleDataset.flatList.singleLanguageWithComments,
      translations: singleLocaleDataset.translations,
    };

    const result = flatListToXmlTransformer.transform(object);

    const expectedObject = {
      ...object,
      result: [
        {
          lang: 'en_US',
          content: `/* Note = "Affirmative, give consent"; */
"core_labels_yes" = "yes";
/* Note = "Negative, refuse consent"; */
"core_labels_no" = "no";
/* Note = "Persist, save consent"; */
"core_labels_save" = "save";
"core_labels_cancel" = "cancel";
`,
        },
      ],
    };
    expect(result).toEqual(expectedObject);
  });
});
