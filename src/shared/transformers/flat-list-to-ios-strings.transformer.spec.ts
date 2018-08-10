import FlatListToIosStringsTransformer from './flat-list-to-ios-strings.transformer';
import ITransformer from './transformer';

describe('FlatListToIosStringsTransformer', () => {
  const flatListToXmlTransformer = new FlatListToIosStringsTransformer();

  it('does return true if supported type', async () => {
    const result = flatListToXmlTransformer.supports('strings');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = flatListToXmlTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate proper string from flat list', async () => {
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
      `"en_us_core_labels_yes" = "yes"
"en_us_core_labels_no" = "no"
"en_us_core_labels_save" = "save"
"en_us_core_labels_cancel" = "cancel"
"pl_pl_core_labels_yes" = "tak"
"pl_pl_core_labels_no" = "nie"
"pl_pl_core_labels_save" = "zapisz"
`
    );
  });
});
