import JsonToFlatListTransformer from './json-to-flat-list.transformer';
import ITransformer from './transformer';

describe('FlatListToIosStringsTransformer', () => {
  const jsonToFlatListTransformer = new JsonToFlatListTransformer();

  it('does return true if supported type', async () => {
    const result = jsonToFlatListTransformer.supports('flat-list');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = jsonToFlatListTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate proper string from flat list', async () => {
    const object = {
      en_US: {
        CORE: {
          LABELS: {
            YES: 'yes',
            NO: 'no',
            SAVE: 'save',
            CANCEL: 'cancel',
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
    };

    const result = jsonToFlatListTransformer.transform(object);

    expect(result).toEqual([
      { name: 'en_us_core_labels_yes', text: 'yes' },
      { name: 'en_us_core_labels_no', text: 'no' },
      { name: 'en_us_core_labels_save', text: 'save' },
      { name: 'en_us_core_labels_cancel', text: 'cancel' },
      { name: 'pl_pl_core_labels_yes', text: 'tak' },
      { name: 'pl_pl_core_labels_no', text: 'nie' },
      { name: 'pl_pl_core_labels_save', text: 'zapisz' },
    ]);
  });
});
