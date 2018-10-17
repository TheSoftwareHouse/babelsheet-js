import FlatListToXlfTransformer from './flat-list-to-xlf.transformer';
import { multiLocaleDataset, singleLocaleDataset } from '../../tests/testData';

describe('JsonToXlfTransformer', () => {
  const flatListToXlfTransformer = new FlatListToXlfTransformer();

  it('does return true if supported type', async () => {
    const result = flatListToXlfTransformer.supports('flat-list-xlf');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = flatListToXlfTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate xlf from proper merged flat list', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, mergeLanguages: true },
      result: multiLocaleDataset.flatList.multiLanguageMerged,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToXlfTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: {
        merged: `<?xml version="1.0"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file datatype="plaintext" source-language="en">
    <body>
      <trans-unit id="en.us.core.labels.yes">
        <source>en.us.core.labels.yes</source>
        <target>yes</target>
      </trans-unit>
      <trans-unit id="en.us.core.labels.no">
        <source>en.us.core.labels.no</source>
        <target>no</target>
      </trans-unit>
      <trans-unit id="en.us.core.labels.save">
        <source>en.us.core.labels.save</source>
        <target>save</target>
      </trans-unit>
      <trans-unit id="en.us.core.labels.cancel">
        <source>en.us.core.labels.cancel</source>
        <target>cancel</target>
      </trans-unit>
      <trans-unit id="pl.pl.core.labels.yes">
        <source>pl.pl.core.labels.yes</source>
        <target>tak</target>
      </trans-unit>
      <trans-unit id="pl.pl.core.labels.no">
        <source>pl.pl.core.labels.no</source>
        <target>nie</target>
      </trans-unit>
      <trans-unit id="pl.pl.core.labels.save">
        <source>pl.pl.core.labels.save</source>
        <target>zapisz</target>
      </trans-unit>
    </body>
  </file>
</xliff>`,
      },
    };
    expect(result).toEqual(expectedObject);
  });
  it('does generate xlf from proper merged flat list with comments', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, mergeLanguages: true, includeComments: true },
      result: multiLocaleDataset.flatList.multiLanguageMergedWithComments,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToXlfTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: {
        merged: `<?xml version="1.0"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file datatype="plaintext" source-language="en">
    <body>
      <trans-unit id="en.us.core.labels.yes">
        <source>en.us.core.labels.yes</source>
        <target>yes</target>
        <note>Affirmative, give consent</note>
      </trans-unit>
      <trans-unit id="en.us.core.labels.no">
        <source>en.us.core.labels.no</source>
        <target>no</target>
        <note>Negative, refuse consent</note>
      </trans-unit>
      <trans-unit id="en.us.core.labels.save">
        <source>en.us.core.labels.save</source>
        <target>save</target>
        <note>Persist, save consent</note>
      </trans-unit>
      <trans-unit id="en.us.core.labels.cancel">
        <source>en.us.core.labels.cancel</source>
        <target>cancel</target>
      </trans-unit>
      <trans-unit id="pl.pl.core.labels.yes">
        <source>pl.pl.core.labels.yes</source>
        <target>tak</target>
        <note>Affirmative, give consent</note>
      </trans-unit>
      <trans-unit id="pl.pl.core.labels.no">
        <source>pl.pl.core.labels.no</source>
        <target>nie</target>
        <note>Negative, refuse consent</note>
      </trans-unit>
      <trans-unit id="pl.pl.core.labels.save">
        <source>pl.pl.core.labels.save</source>
        <target>zapisz</target>
        <note>Persist, save consent</note>
      </trans-unit>
    </body>
  </file>
</xliff>`,
      },
    };

    expect(result).toEqual(expectedObject);
  });
  it('does generate xlf from proper multi language flat list with comments', async () => {
    const object = {
      meta: { ...multiLocaleDataset.meta, includeComments: true },
      result: multiLocaleDataset.flatList.multiLanguageNonMergedWithComments,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToXlfTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: [
        {
          lang: 'en_US',
          content: `<?xml version="1.0"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file datatype="plaintext" source-language="en">
    <body>
      <trans-unit id="core.labels.yes">
        <source>core.labels.yes</source>
        <target>yes</target>
        <note>Affirmative, give consent</note>
      </trans-unit>
      <trans-unit id="core.labels.no">
        <source>core.labels.no</source>
        <target>no</target>
        <note>Negative, refuse consent</note>
      </trans-unit>
      <trans-unit id="core.labels.save">
        <source>core.labels.save</source>
        <target>save</target>
        <note>Persist, save consent</note>
      </trans-unit>
      <trans-unit id="core.labels.cancel">
        <source>core.labels.cancel</source>
        <target>cancel</target>
      </trans-unit>
    </body>
  </file>
</xliff>`,
        },
        {
          lang: 'pl_PL',
          content: `<?xml version="1.0"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file datatype="plaintext" source-language="en">
    <body>
      <trans-unit id="core.labels.yes">
        <source>core.labels.yes</source>
        <target>tak</target>
        <note>Affirmative, give consent</note>
      </trans-unit>
      <trans-unit id="core.labels.no">
        <source>core.labels.no</source>
        <target>nie</target>
        <note>Negative, refuse consent</note>
      </trans-unit>
      <trans-unit id="core.labels.save">
        <source>core.labels.save</source>
        <target>zapisz</target>
        <note>Persist, save consent</note>
      </trans-unit>
    </body>
  </file>
</xliff>`,
        },
      ],
    };

    expect(result).toEqual(expectedObject);
  });

  it('does generate xlf from proper multi language flat list without comments', async () => {
    const object = {
      meta: multiLocaleDataset.meta,
      result: multiLocaleDataset.flatList.multiLanguageNonMerged,
      translations: multiLocaleDataset.translations,
    };

    const result = flatListToXlfTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: [
        {
          lang: 'en_US',
          content: `<?xml version="1.0"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file datatype="plaintext" source-language="en">
    <body>
      <trans-unit id="core.labels.yes">
        <source>core.labels.yes</source>
        <target>yes</target>
      </trans-unit>
      <trans-unit id="core.labels.no">
        <source>core.labels.no</source>
        <target>no</target>
      </trans-unit>
      <trans-unit id="core.labels.save">
        <source>core.labels.save</source>
        <target>save</target>
      </trans-unit>
      <trans-unit id="core.labels.cancel">
        <source>core.labels.cancel</source>
        <target>cancel</target>
      </trans-unit>
    </body>
  </file>
</xliff>`,
        },
        {
          lang: 'pl_PL',
          content: `<?xml version="1.0"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file datatype="plaintext" source-language="en">
    <body>
      <trans-unit id="core.labels.yes">
        <source>core.labels.yes</source>
        <target>tak</target>
      </trans-unit>
      <trans-unit id="core.labels.no">
        <source>core.labels.no</source>
        <target>nie</target>
      </trans-unit>
      <trans-unit id="core.labels.save">
        <source>core.labels.save</source>
        <target>zapisz</target>
      </trans-unit>
    </body>
  </file>
</xliff>`,
        },
      ],
    };

    expect(result).toEqual(expectedObject);
  });
  it('does generate xlf from proper single language flat list with comments', async () => {
    const object = {
      meta: { ...singleLocaleDataset.meta, includeComments: true },
      result: singleLocaleDataset.flatList.singleLanguageWithComments,
      translations: singleLocaleDataset.translations,
    };

    const result = flatListToXlfTransformer.transform(object);
    const expectedObject = {
      ...object,
      result: [
        {
          lang: 'en_US',
          content: `<?xml version="1.0"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file datatype="plaintext" source-language="en">
    <body>
      <trans-unit id="core.labels.yes">
        <source>core.labels.yes</source>
        <target>yes</target>
        <note>Affirmative, give consent</note>
      </trans-unit>
      <trans-unit id="core.labels.no">
        <source>core.labels.no</source>
        <target>no</target>
        <note>Negative, refuse consent</note>
      </trans-unit>
      <trans-unit id="core.labels.save">
        <source>core.labels.save</source>
        <target>save</target>
        <note>Persist, save consent</note>
      </trans-unit>
      <trans-unit id="core.labels.cancel">
        <source>core.labels.cancel</source>
        <target>cancel</target>
      </trans-unit>
    </body>
  </file>
</xliff>`,
        },
      ],
    };

    expect(result).toEqual(expectedObject);
  });
});
