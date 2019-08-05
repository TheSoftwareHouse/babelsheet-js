import FlatListToPoTransformer from './flat-list-to-po.transformer';
import { multiLocaleDataset, singleLocaleDataset } from '../../tests/testData';

describe('FlatListToPoTransformer', () => {
  const flatListToPoTransformer = new FlatListToPoTransformer();

  it('does return true if supported type', async () => {
    const result = flatListToPoTransformer.supports('flat-list-po');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = flatListToPoTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate proper po from merged flat list', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, mergeLanguages: true },
      result: multiLocaleDataset.flatList.multiLanguageMergedWithComments,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToPoTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: {
        merged: `msgid ""
msgstr ""
"Language: \\n"
"Content-Type: text/plain; charset=utf-8\\n"

msgid "en_us_core_labels_yes"
msgstr "yes"

msgid "en_us_core_labels_no"
msgstr "no"

msgid "en_us_core_labels_save"
msgstr "save"

msgid "en_us_core_labels_cancel"
msgstr "cancel"

msgid "pl_pl_core_labels_yes"
msgstr "tak"

msgid "pl_pl_core_labels_no"
msgstr "nie"

msgid "pl_pl_core_labels_save"
msgstr "zapisz"`,
      },
    };

    expect(result).toEqual(expectedObject);
  });

  it('does generate proper po from flat list with comments', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, includeComments: true },
      result: multiLocaleDataset.flatList.multiLanguageNonMergedWithComments,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToPoTransformer.transform(object);

    const expectedObject = {
      ...object,
      result: [
        {
          lang: 'en_US',
          content: `msgid ""
msgstr ""
"Language: en\\n"
"Content-Type: text/plain; charset=utf-8\\n"

# Affirmative, give consent
msgid "core_labels_yes"
msgstr "yes"

# Negative, refuse consent
msgid "core_labels_no"
msgstr "no"

# Persist, save consent
msgid "core_labels_save"
msgstr "save"

msgid "core_labels_cancel"
msgstr "cancel"`,
        },
        {
          lang: 'pl_PL',
          content: `msgid ""
msgstr ""
"Language: pl\\n"
"Content-Type: text/plain; charset=utf-8\\n"

# Affirmative, give consent
msgid "core_labels_yes"
msgstr "tak"

# Negative, refuse consent
msgid "core_labels_no"
msgstr "nie"

# Persist, save consent
msgid "core_labels_save"
msgstr "zapisz"`,
        },
      ],
    };

    expect(result).toEqual(expectedObject);
  });

  it('does generate proper po from flat list without comments', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta },
      result: multiLocaleDataset.flatList.multiLanguageNonMergedWithComments,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToPoTransformer.transform(object);

    const expectedObject = {
      ...object,
      result: [
        {
          lang: 'en_US',
          content: `msgid ""
msgstr ""
"Language: en\\n"
"Content-Type: text/plain; charset=utf-8\\n"

msgid "core_labels_yes"
msgstr "yes"

msgid "core_labels_no"
msgstr "no"

msgid "core_labels_save"
msgstr "save"

msgid "core_labels_cancel"
msgstr "cancel"`,
        },
        {
          lang: 'pl_PL',
          content: `msgid ""
msgstr ""
"Language: pl\\n"
"Content-Type: text/plain; charset=utf-8\\n"

msgid "core_labels_yes"
msgstr "tak"

msgid "core_labels_no"
msgstr "nie"

msgid "core_labels_save"
msgstr "zapisz"`,
        },
      ],
    };

    expect(result).toEqual(expectedObject);
  });

  it('does generate proper po from flat list with single language', async () => {
    const object = {
      meta: { ...singleLocaleDataset.meta, includeComments: true },
      result: singleLocaleDataset.flatList.singleLanguageWithComments,
      translations: singleLocaleDataset.translations,
    };

    const result = flatListToPoTransformer.transform(object);

    const expectedObject = {
      ...object,
      result: [
        {
          lang: 'en_US',
          content: `msgid ""
msgstr ""
"Language: en\\n"
"Content-Type: text/plain; charset=utf-8\\n"

# Affirmative, give consent
msgid "core_labels_yes"
msgstr "yes"

# Negative, refuse consent
msgid "core_labels_no"
msgstr "no"

# Persist, save consent
msgid "core_labels_save"
msgstr "save"

msgid "core_labels_cancel"
msgstr "cancel"`,
        },
      ],
    };
    expect(result).toEqual(expectedObject);
  });
});
