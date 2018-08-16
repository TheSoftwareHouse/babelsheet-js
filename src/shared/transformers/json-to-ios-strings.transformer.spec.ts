import JsonToIosStringsTransformer from './json-to-ios-strings.transformer';
import ITransformer from './transformer';

const jsonToFlatList: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'json-flat-list return'),
};

const flatListToIosStrings: ITransformer = {
  supports: type => false,
  transform: jest.fn(() => 'flat-list-ios-strings return'),
};

describe('JsonToXmlTransformer', () => {
  const jsonToIosStrings = new JsonToIosStringsTransformer(jsonToFlatList, flatListToIosStrings);

  it('does return true if supported type', async () => {
    const result = jsonToIosStrings.supports('json-ios-strings');

    expect(result).toBeTruthy();
  });

  it('does return false if not supported type', async () => {
    const result = jsonToIosStrings.supports('xyz');

    expect(result).toBeFalsy();
  });

  it('does generate ios strings from json', async () => {
    const object = { test: ['test'] };

    jsonToIosStrings.transform(object);

    expect(jsonToFlatList.transform).toBeCalledWith(object);
    expect(flatListToIosStrings.transform).toBeCalledWith('json-flat-list return');
  });
});
