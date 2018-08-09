import JsonToXmlTransformer from './json-to-xml.transformer';

describe('JsonToXmlTransformer', () => {
  const jsonToXmlTransformer = new JsonToXmlTransformer();

  it('does return true if supported type', async () => {
    const result = jsonToXmlTransformer.supports('json-xml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = jsonToXmlTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate xml from json object', async () => {
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

    const result = jsonToXmlTransformer.transform(object);

    expect(result).toBe(
      `<?xml version="1.0"?><resources><string name="en_US.CORE.LABELS.YES">yes</string><string name="en_US.CORE.LABELS.NO">no</string><string name="en_US.CORE.LABELS.SAVE">save</string><string name="en_US.CORE.LABELS.CANCEL">cancel</string><string name="pl_PL.CORE.LABELS.YES">tak</string><string name="pl_PL.CORE.LABELS.NO">nie</string><string name="pl_PL.CORE.LABELS.SAVE">zapisz</string></resources>`
    );
  });
});
