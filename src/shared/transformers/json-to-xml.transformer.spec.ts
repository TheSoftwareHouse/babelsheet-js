import JsonToXmlTransformer from './json-to-xml.transformer';
import ITransformer from './transformer';

const jsonToFlatList: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'json-flat-list return'),
};

const flatListToXml: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'flat-list-xml return'),
};

describe('JsonToXmlTransformer', () => {
  const jsonToXmlTransformer = new JsonToXmlTransformer(jsonToFlatList, flatListToXml);

  it('does return true if supported type', async () => {
    const result = jsonToXmlTransformer.supports('json-xml');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = jsonToXmlTransformer.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate xml from json', async () => {
    const object = { test: ['test'] };

    jsonToXmlTransformer.transform(object);

    expect(jsonToFlatList.transform).toBeCalledWith(object);
    expect(flatListToXml.transform).toBeCalledWith('json-flat-list return');
  });
});
