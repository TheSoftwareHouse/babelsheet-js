import FlatListToXlfTransformer from './flat-list-to-xlf.transformer';

describe('JsonToXmlTransformer', () => {
  const flatListToXlfTransformer = new FlatListToXlfTransformer();

  it('does return true if supported type', async () => {
    const result = flatListToXlfTransformer.supports('flat-list-xlf');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = flatListToXlfTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate xml from proper flat list', async () => {
    const flatList = [
      { name: 'en_us_core_labels_yes', text: 'yes' },
      { name: 'en_us_core_labels_no', text: 'no' },
      { name: 'en_us_core_labels_save', text: 'save' },
      { name: 'en_us_core_labels_cancel', text: 'cancel' },
      { name: 'pl_pl_core_labels_yes', text: 'tak' },
      { name: 'pl_pl_core_labels_no', text: 'nie' },
      { name: 'pl_pl_core_labels_save', text: 'zapisz' },
    ];

    const result = flatListToXlfTransformer.transform(flatList);

    expect(result).toBe(
      `<?xml version="1.0"?><xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2"><file datatype="plaintext" source-language="en"><body><trans-unit id="en.us.core.labels.yes"><source>en.us.core.labels.yes</source><target>yes</target></trans-unit><trans-unit id="en.us.core.labels.no"><source>en.us.core.labels.no</source><target>no</target></trans-unit><trans-unit id="en.us.core.labels.save"><source>en.us.core.labels.save</source><target>save</target></trans-unit><trans-unit id="en.us.core.labels.cancel"><source>en.us.core.labels.cancel</source><target>cancel</target></trans-unit><trans-unit id="pl.pl.core.labels.yes"><source>pl.pl.core.labels.yes</source><target>tak</target></trans-unit><trans-unit id="pl.pl.core.labels.no"><source>pl.pl.core.labels.no</source><target>nie</target></trans-unit><trans-unit id="pl.pl.core.labels.save"><source>pl.pl.core.labels.save</source><target>zapisz</target></trans-unit></body></file></xliff>`
    );
  });
});
