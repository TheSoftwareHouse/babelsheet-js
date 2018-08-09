import FlatListToJsonTransformer from './flat-list-to-xml.transformer';
import ITransformer from './transformer';

describe('JsonToXmlTransformer', () => {
  const flatListToXmlTransformer = new FlatListToJsonTransformer();

  it('does return true if supported type', async () => {
    const result = flatListToXmlTransformer.supports('flat-list-xml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = flatListToXmlTransformer.supports('xyz');

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

    const result = flatListToXmlTransformer.transform(flatList);

    expect(result).toBe(
      `<?xml version="1.0"?><resources><string name="en_us_core_labels_yes">yes</string><string name="en_us_core_labels_no">no</string><string name="en_us_core_labels_save">save</string><string name="en_us_core_labels_cancel">cancel</string><string name="pl_pl_core_labels_yes">tak</string><string name="pl_pl_core_labels_no">nie</string><string name="pl_pl_core_labels_save">zapisz</string></resources>`
    );
  });
});
