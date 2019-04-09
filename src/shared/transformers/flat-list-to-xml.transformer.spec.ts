import FlatListToXmlTransformer from './flat-list-to-xml.transformer';
import { multiLocaleDataset, singleLocaleDataset } from '../../tests/testData';

describe('FlatListToXmlTransformer', () => {
  const flatListToXmlTransformer = new FlatListToXmlTransformer();

  it('does return true if supported type', async () => {
    const result = flatListToXmlTransformer.supports('flat-list-xml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = flatListToXmlTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate xml from merged flat list', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, mergeLanguages: true },
      result: multiLocaleDataset.flatList.multiLanguageMerged,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToXmlTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: {
        merged: `<?xml version="1.0"?>
<resources>
  <string name="en_us_core_labels_yes">yes</string>
  <string name="en_us_core_labels_no">no</string>
  <string name="en_us_core_labels_save">save</string>
  <string name="en_us_core_labels_cancel">cancel</string>
  <string name="pl_pl_core_labels_yes">tak</string>
  <string name="pl_pl_core_labels_no">nie</string>
  <string name="pl_pl_core_labels_save">zapisz</string>
</resources>`,
      },
    };

    expect(result).toEqual(expectedObject);
  });

  it('does generate xml from proper merged flat list with comments', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, mergeLanguages: true, includeComments: true },
      result: multiLocaleDataset.flatList.multiLanguageMergedWithComments,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToXmlTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: {
        merged: `<?xml version="1.0"?>
<resources>
  <string name="en_us_core_labels_yes">yes</string>
  <!-- Affirmative, give consent -->
  <string name="en_us_core_labels_no">no</string>
  <!-- Negative, refuse consent -->
  <string name="en_us_core_labels_save">save</string>
  <!-- Persist, save consent -->
  <string name="en_us_core_labels_cancel">cancel</string>
  <string name="pl_pl_core_labels_yes">tak</string>
  <!-- Affirmative, give consent -->
  <string name="pl_pl_core_labels_no">nie</string>
  <!-- Negative, refuse consent -->
  <string name="pl_pl_core_labels_save">zapisz</string>
  <!-- Persist, save consent -->
</resources>`,
      },
    };

    expect(result).toEqual(expectedObject);
  });
  it('does generate xml from proper merged flat list without comments', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, mergeLanguages: true, includeComments: false },
      result: multiLocaleDataset.flatList.multiLanguageMergedWithComments,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToXmlTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: {
        merged: `<?xml version="1.0"?>
<resources>
  <string name="en_us_core_labels_yes">yes</string>
  <string name="en_us_core_labels_no">no</string>
  <string name="en_us_core_labels_save">save</string>
  <string name="en_us_core_labels_cancel">cancel</string>
  <string name="pl_pl_core_labels_yes">tak</string>
  <string name="pl_pl_core_labels_no">nie</string>
  <string name="pl_pl_core_labels_save">zapisz</string>
</resources>`,
      },
    };

    expect(result).toEqual(expectedObject);
  });
  it('does generate xml from proper multi language flat list with comments', async () => {
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
          content: `<?xml version="1.0"?>
<resources>
  <string name="core_labels_yes">yes</string>
  <!-- Affirmative, give consent -->
  <string name="core_labels_no">no</string>
  <!-- Negative, refuse consent -->
  <string name="core_labels_save">save</string>
  <!-- Persist, save consent -->
  <string name="core_labels_cancel">cancel</string>
</resources>`,
        },
        {
          lang: 'pl_PL',
          content: `<?xml version="1.0"?>
<resources>
  <string name="core_labels_yes">tak</string>
  <!-- Affirmative, give consent -->
  <string name="core_labels_no">nie</string>
  <!-- Negative, refuse consent -->
  <string name="core_labels_save">zapisz</string>
  <!-- Persist, save consent -->
</resources>`,
        },
      ],
    };

    expect(result).toEqual(expectedObject);
  });
  it('does generate xml from proper multi language flat list without comments', async () => {
    const object = {
      meta: multiLocaleDataset.meta,
      result: multiLocaleDataset.flatList.multiLanguageNonMerged,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToXmlTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: [
        {
          lang: 'en_US',
          content: `<?xml version="1.0"?>
<resources>
  <string name="core_labels_yes">yes</string>
  <string name="core_labels_no">no</string>
  <string name="core_labels_save">save</string>
  <string name="core_labels_cancel">cancel</string>
</resources>`,
        },
        {
          lang: 'pl_PL',
          content: `<?xml version="1.0"?>
<resources>
  <string name="core_labels_yes">tak</string>
  <string name="core_labels_no">nie</string>
  <string name="core_labels_save">zapisz</string>
</resources>`,
        },
      ],
    };

    expect(result).toEqual(expectedObject);
  });
  it('does generate xlf from proper single language flat list without comments', async () => {
    const object = {
      meta: singleLocaleDataset.meta,
      result: singleLocaleDataset.flatList.singleLanguage,
      translations: singleLocaleDataset.translations,
    };

    const result = flatListToXmlTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: [
        {
          lang: 'en_US',
          content: `<?xml version="1.0"?>
<resources>
  <string name="core_labels_yes">yes</string>
  <string name="core_labels_no">no</string>
  <string name="core_labels_save">save</string>
  <string name="core_labels_cancel">cancel</string>
</resources>`,
        },
      ],
    };

    expect(result).toEqual(expectedObject);
  });
});
